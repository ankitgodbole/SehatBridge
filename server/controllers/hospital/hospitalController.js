const { hospitalSchema } = require("../../validators/hospitalSchemas.js");
const Hospital = require("../../models/hospital.js");
const { z } = require("zod");

// Create a new hospital
const createHospital = async (req, res) => {
  try {
    console.log(req.body);
    const parsedData = hospitalSchema.parse(req.body);
    const hospital = new Hospital(parsedData);
    await hospital.save();
    res.status(201).send(hospital);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }
    res.status(400).send(error);
  }
};

// Search hospital using a query string (?q=xyz)
const searchHospitalByQuery = async (req, res) => {
  const query = req.query.q;
  try {
    let hospitals;
    if (query) {
      const regex = new RegExp(query, "i");
      hospitals = await Hospital.find({
        $or: [
          { name: { $regex: regex } },
          { "address.street": { $regex: regex } },
          { "address.city": { $regex: regex } },
          { "address.state": { $regex: regex } },
        ],
      });
    } else {
      hospitals = await Hospital.find();
    }
    res.status(200).json(hospitals);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get hospital by ID
const getHospitalByID = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).send({ message: "Hospital not found" });
    res.send(hospital);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update hospital by ID
const updateHospitalByID = async (req, res) => {
  try {
    const parsedData = hospitalSchema.partial().parse(req.body);
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      parsedData,
      { new: true, runValidators: true }
    );
    if (!hospital) return res.status(404).send({ message: "Hospital not found" });
    res.send(hospital);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }
    res.status(400).send(error);
  }
};

// Delete hospital by ID
const deleteHospitalByID = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) return res.status(404).send({ message: "Hospital not found" });
    res.send(hospital);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createHospital,
  searchHospitalByQuery,
  getHospitalByID,
  updateHospitalByID,
  deleteHospitalByID,
};
