const NodeGeocoder = require("node-geocoder");
const dotenv = require("dotenv");
dotenv.config();

const options = {
  provider: "opencage",
  apiKey: process.env.OPENCAGE_API_KEY,
};

const geocoder = NodeGeocoder(options);

const geocodeAddress = async (postalCode) => {
  try {
    const res = await geocoder.geocode({ postalcode: postalCode, country: "IN" });
    return res;
  } catch (error) {
    console.error("Geocoding error:", error.message);
    return [];
  }
};

module.exports = { geocodeAddress };
