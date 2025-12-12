const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load .env

const app = express();

app.use(express.json());
app.use(express.static("public")); // Public folder serve

// ⭐ Correct MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// ⭐ Schema: single document for live location update
const LocationSchema = new mongoose.Schema({
  name: { type: String, unique: true }, // Always "current"
  latitude: String,
  longitude: String,
  time: String // IST time string
});

const Location = mongoose.model("Location", LocationSchema);

// ⭐ API: Save & Update Live Location
app.post("/save-location", async (req, res) => {
  try {
    // India IST Time
    const indiaTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true
    });

    console.log("API HIT (IST):", indiaTime, "Body:", req.body);

    const filter = { name: "current" };
    const update = {
      $set: {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        time: indiaTime
      }
    };

    // If document not found -> create; found -> update
    await Location.updateOne(filter, update, { upsert: true });

    res.json({ success: true });
  } catch (err) {
    console.log("DB Save Error:", err);
    res.json({ success: false, error: err.message });
  }
});

// ⭐ Start Server
app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
