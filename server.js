const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

dotenv.config();

const app = express();

/* Middlewares */
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* MongoDB Connect */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err));

/* Schema */
const LocationSchema = new mongoose.Schema({
  identifier: { type: String, unique: true },
  latitude: Number,
  longitude: Number,
  time: String
});

const Location = mongoose.model("Location", LocationSchema);

/* Save / Update Location */
app.post("/save-location", async (req, res) => {
  try {
    const indiaTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true
    });

    const identifier = req.ip; // future safe

    await Location.updateOne(
      { identifier },
      {
        $set: {
          latitude: req.body.latitude,
          longitude: req.body.longitude,
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

/* Serve Frontend */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

/* Start Server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
