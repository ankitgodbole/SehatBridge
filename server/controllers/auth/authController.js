const { z } = require("zod");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.js");
const Hospital = require("../../models/hospital.js");
const { geocodeAddress } = require("../../config/geocoder.js");
const {
  userSchema,
  hospitalSchema,
  loginSchema,
  emailCheckSchema,
  otpVerificationSchema,
  passwordResetSchema,
} = require("../../validators/authSchemas.js");
const {
  hashPassword,
  comparePassword,
} = require("../../utils/bcrypt/bcryptUtils.js");
const { generateOTP, verifyOTP, clearOTP } = require("../../utils/otputils.js");
const jwtSecret = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  try {
    const { type } = req.body;

    if (type === "user") {
      const userParseData = userSchema.parse(req.body);
      const {
        name,
        email,
        password,
        phone,
        dob,
        gender,
        address,
        medicalHistory,
      } = userParseData;

      const hashedPassword = await hashPassword(password);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        dob,
        gender,
        address,
        medicalHistory,
      });

      await user.save();
      return res.status(201).json({ message: "User registered successfully" });
    }

    if (type === "hospital") {
      const hospitalParseData = hospitalSchema.parse(req.body);
      const {
        name,
        email,
        password,
        phone,
        website,
        department,
        availableServices,
        address,
      } = hospitalParseData;

      if (!address.postalCode) {
        return res.status(400).json({ message: "Pincode is required" });
      }

      const lat = 0.0;
      const long = 0.0;

      const hashedPassword = await hashPassword(password);

      const hospital = new Hospital({
        name,
        email,
        phone,
        password: hashedPassword,
        website,
        department,
        availableServices,
        address,
        lat,
        long,
      });

      await hospital.save();
      return res.status(201).json({
        message: "Hospital registered successfully",
        hospital,
      });
    }

    return res.status(400).json({ message: "Invalid type" });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    return res.status(500).json({ message: "Error registering user/hospital", error });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    const parsedData = loginSchema.parse(req.body);
    const { type, email, password } = parsedData;

    const userOrHospital = await (type === "user"
      ? User.findOne({ email })
      : Hospital.findOne({ email }));

    if (!userOrHospital)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await comparePassword(password, userOrHospital.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const payload = { user: { id: userOrHospital.id } };
    jwt.sign(payload, jwtSecret, { expiresIn: 3600 * 3 * 24 }, (err, token) => {
      if (err) throw err;
      res.json({ token, message: `${type} logged in successfully` });
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Error logging in", error: error.message || "An unknown error occurred" });
  }
};

const createUserFromGoogleSignIn = async (googleProfile) => {
  try {
    const { id, displayName, emails } = googleProfile;

    if (!emails || emails.length === 0 || !emails[0].value) {
      throw new Error("Email not available in Google profile");
    }

    const email = emails[0].value;
    const hashedPassword = await hashPassword(id);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const payload = { user: { id: existingUser._id } };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: "3d" });
      return { user: existingUser, token };
    }

    const userObject = {
      type: "user",
      name: displayName || "Google User",
      email,
      password: hashedPassword,
      phone: "0000000000",
      address: {
        street: "Unknown",
        city: "Unknown",
        state: "Unknown",
        postalCode: "000000",
      },
      gender: "Other",
      dob: new Date("2000-01-01"),
      medicalHistory: [],
    };

    const parsedUser = userSchema.parse(userObject);

    const newUser = new User(parsedUser);
    await newUser.save();

    const payload = { user: { id: newUser._id } };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "3d" });

    return { user: newUser, token };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      throw new Error("Validation failed");
    }
    console.error("Error creating user from Google sign-in:", error.message);
    throw new Error("Failed to create user from Google sign-in");
  }
};

const forgotPassword = async (req, res) => {
  try {
    const parsedData = emailCheckSchema.parse(req.body);
    const { type, email } = parsedData;

    const userOrHospital = await (type === "user"
      ? User.findOne({ email })
      : Hospital.findOne({ email }));

    if (!userOrHospital) {
      return res.status(404).json({ message: "Email not found" });
    }

    const otp = generateOTP();
    userOrHospital.otp = otp;
    userOrHospital.otpExpiry = Date.now() + 10 * 60 * 1000;
    await userOrHospital.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"SehatBridge" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Password Reset OTP for SehatBridge",
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent:", info.response);

    return res.status(200).json({ message: "OTP sent to email successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    return res.status(500).json({ message: "Error sending OTP email", error: error.message || "Unexpected error occurred" });
  }
};

const verifyOTPApi = async (req, res) => {
  try {
    const parsedData = otpVerificationSchema.parse(req.body);
    const { email, otp } = parsedData;

    const userOrHospital = (await User.findOne({ email })) || (await Hospital.findOne({ email }));

    if (!userOrHospital) {
      return res.status(404).json({ message: "User or hospital not found" });
    }

    if (!verifyOTP(userOrHospital, otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await clearOTP(userOrHospital);
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Error verifying OTP", error: error.message || "An unknown error occurred" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { type, email, newPassword } = passwordResetSchema.parse(req.body);
    const userOrHospital = type === "user" ? await User.findOne({ email }) : await Hospital.findOne({ email });

    if (!userOrHospital) {
      return res.status(404).json({ message: "User or hospital not found" });
    }

    const hashedPassword = await hashPassword(newPassword);
    userOrHospital.password = hashedPassword;

    await clearOTP(userOrHospital);
    await userOrHospital.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Error resetting password", error: error.message || "Unexpected error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  createUserFromGoogleSignIn,
  forgotPassword,
  verifyOTPApi,
  resetPassword,
};
