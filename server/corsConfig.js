// corsConfig.js

const cors = require('cors');

// Configure CORS options
const corsOptions = {
  origin: 'https://sehat-bridge.vercel.app', // Allow only requests from this frontend URL
  methods: ['GET', 'POST'],  // Allow only GET and POST methods (you can add others as needed)
  allowedHeaders: ['Content-Type'], // Allow only the 'Content-Type' header (add more if needed)
};

module.exports = corsOptions;
