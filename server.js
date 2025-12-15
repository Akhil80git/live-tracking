const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

dotenv.config();

const app = express();

/* ================= BASIC SETTINGS ================= */
app.set("trust proxy", 1);

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ================= MONGODB CONNECT ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ================= SCHEMA ================= */
const LocationSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    index: true
  },
  latitude: Number,
  longitude: Number,
  time: String
});

const Location = mongoose.model("Location", LocationSchema);

/* ================= SAVE / UPDATE LOCATION ================= */
app.post("/save-location", async (req, res) => {
  try {
    const { deviceId, latitude, longitude } = req.body;

    if (!deviceId || latitude == null || longitude == null) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const indiaTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true
    });

    await Location.updateOne(
      { identifier: deviceId },
      {
        $set: {
          latitude,
          longitude,
          time: indiaTime
        }
      },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Save Error:", err);
    res.status(500).json({ success: false });
  }
});

/* ================= FRONTEND ROUTE ================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

/* ================= SERVER START ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
