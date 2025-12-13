const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected (livetrack)"))
  .catch((err) => console.log("❌ DB Error:", err));

// Schema
const LocationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  time: String
});

// Model → collection name = location
const Location = mongoose.model("Location", LocationSchema, "location");

// API to save location
app.post("/save-location", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        error: "Latitude & Longitude required"
      });
    }

    const indiaTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true
    });

    await Location.create({
      latitude,
      longitude,
      time: indiaTime
    });

    console.log("📍 Location saved");

    res.json({
      success: true,
      message: "Location saved"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
