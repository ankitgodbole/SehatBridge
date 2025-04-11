exports.registerEmergency = (req, res) => {
  const { name, age, problem } = req.body;
  if (!name || !age || !problem) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  // Aap yahan DB integration bhi kar sakte ho
  return res.status(201).json({
    msg: "Emergency patient registered successfully",
    data: { name, age, problem },
  });
};
