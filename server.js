const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // index.html serve

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

// Schema
const LocationSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  latitude: String,
  longitude: String,
  time: String
});
const Location = mongoose.model("Location", LocationSchema);

// API to save/update location
app.post("/save-location", async (req, res) => {
  try {
    const indiaTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: true });

    const filter = { name: "current" };
    const update = { $set: { latitude: req.body.latitude, longitude: req.body.longitude, time: indiaTime } };

    await Location.updateOne(filter, update, { upsert: true });
    res.json({ success: true });
  } catch (err) {
    console.log("DB Save Error:", err);
    res.json({ success: false, error: err.message });
  }
});

// Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
