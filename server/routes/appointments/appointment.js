const express = require("express");
const { authenticateToken } = require("../../middlewares/authMiddleware.js");
const {
  bookAppointmentByHospitalID,
  getAppointemntsByHospitalID,
  addAppointment,
  updateAppointmentByID,
  deleteAppointmentByID,
  addEmergencyAppointment,
} = require("../../controllers/appointments/appointmentsController.js");

const router = express.Router();

// Book appointment for a hospital
router.post("/hospitals/:id/book", bookAppointmentByHospitalID);

// ✅ Only one GET route for getting appointments
router.get("/appointments/:hospitalId", getAppointemntsByHospitalID);

// ✅ Consider changing this if addAppointment is needed
// Example alternative: POST to manually add an appointment
router.post("/appointments/:hospitalId/add", addAppointment);

// Protected routes
router.put(
  "/appointments/:appointmentId",
  authenticateToken,
  updateAppointmentByID
);
router.patch(
  "/appointments/:appointmentId",
  authenticateToken,
  deleteAppointmentByID
);
router.delete("/:id", authenticateToken); // Optional: define what this does

// Public emergency route
router.post("/emergency", addEmergencyAppointment);

module.exports = router;
