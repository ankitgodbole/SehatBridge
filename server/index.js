const express = require("express");
const bodyParser = require('body-parser');
const { PythonShell } = require('python-shell');

const mongoose = require("mongoose");
const User = require("./models/user");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const authRouter = require("./routes/auth/auth");
const profileRouter = require("./routes/user/profile");
const hospitalRouter = require("./routes/hospital/hospital");
const appointmentRouter = require("./routes/appointments/appointment");
const emergencyRouter = require("./routes/hospital/hospitalapi");
const otherroutes = require("./routes/otherroutes/otherroutes");
const client = require("prom-client");
const { connectDB, corsConfig } = require("./utils");
const Hospital = require("./models/hospital");
const { createUserFromGoogleSignIn } = require("./controllers/auth/authController");
require("dotenv").config();

// JWT Secret Key
const jwtSecret = process.env.JWT_SECRET;
const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";

// Database Connection
const uri = process.env.MONGO_URI;
connectDB(uri);

// Prometheus Metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

// App Init
const app = express();
const port = process.env.PORT || 8081;


app.use(bodyParser.json());


// Middleware
corsConfig(app);
app.use(express.static("public"));
app.use(express.json());
app.use(helmet());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.post('/predict-disease', (req, res) => {
  const { name, symptoms } = req.body;
  
  console.log('Received name:', name);
  console.log('Received symptoms:', symptoms);
  
  let options = {
    args: [JSON.stringify(symptoms)]  // Pass symptoms as a valid JSON array string
};

  PythonShell.run('predict.py', options, (err, result) => {
    if (err) {
      console.error('Error running Python script:', err);
      res.status(500).send({ error: 'Prediction failed' });
      return;
    }

    console.log('Prediction result:', result);

    // Assuming result is in the format { disease, description, precautions }
    const prediction = JSON.parse(result[0]);
    res.json({
      name,
      disease: prediction.disease,
      description: prediction.description,
      precautions: prediction.precautions
    });
  });
});

// Google Auth Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), async (req, res) => {
  try {
    const { id, displayName, emails } = req.user;

    if (!emails || emails.length === 0) {
      return res.status(400).json({ message: "No email found in Google profile." });
    }

    const email = emails[0].value;
    let userOrHospital = await User.findOne({ email }) || await Hospital.findOne({ email });
    let token;

    if (!userOrHospital) {
      const { user, token: newToken } = await createUserFromGoogleSignIn({ id, displayName, emails });
      token = newToken;
    } else {
      const payload = { user: { id: userOrHospital.id } };
      token = jwt.sign(payload, jwtSecret, { expiresIn: "3d" });
    }

    res.send(`
      <script>
        window.opener.postMessage({ token: '${token}' }, '${frontendURL}');
        window.close();
      </script>
    `);
  } catch (error) {
    console.error("Google sign-in error:", error);
    res.status(500).json({ message: "Error signing in with Google", error });
  }
});

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid", err });
  }
};

// Logout
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(frontendURL);
  });
});

// Protected Example
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching profile" });
  }
});

// Health Check
app.get("/ping", (_, res) => {
  res.status(200).json({ message: "pong" });
});

// Prometheus Metrics
app.get("/metrics", async (_, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  res.send(await client.register.metrics());
});

// Auth Routes
app.use("/auth", authRouter);
app.use("/auth", profileRouter);

// Hospital Routes
app.use("/hospitalapi/hospitals", hospitalRouter);
app.use("/hospitalapi/appointments", appointmentRouter);
app.use("/hospitalapi/emergency", emergencyRouter);

// Other Routes
app.use("/otherroutes", otherroutes);

// Contact Form Schema & Route
const ContactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  company: String,
  jobTitle: String,
  organizationType: String,
  solutions: [String],
  message: String,
  consent: Boolean,
});
const Contact = mongoose.model("Contact", ContactSchema);

app.post("/api/contact", async (req, res) => {
  try {
    const data = req.body;
    const contact = new Contact(data);
    await contact.save();
    res.status(200).json({ message: "Inquiry submitted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit inquiry." });
  }
});

// Log All Registered Routes (Optional Debug)
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`Registered route: ${r.route.path}`);
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
