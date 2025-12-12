const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static("public")); // frontend serve

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// Schema
const LocationSchema = new mongoose.Schema({
  latitude: String,
  longitude: String,
  time: String
});

const Location = mongoose.model("Location", LocationSchema);

// Save Location API
app.post("/save-location", async (req, res) => {
  try {
    const indiaTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true
    });

    await Location.create({
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      time: indiaTime
    });

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// Render ke liye PORT fix
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
