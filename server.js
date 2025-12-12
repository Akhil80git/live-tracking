const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public")); // public/index.html serve karega

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// Schema: ek hi document ko baar‑baar update karne ke liye "name" field
const LocationSchema = new mongoose.Schema({
  name: { type: String, unique: true }, // e.g. "current"
  latitude: String,
  longitude: String,
  // India (IST) time string store karenge
  time: { type: String }
});

const Location = mongoose.model("Location", LocationSchema);

// API: /save-location -> ek hi doc ko upsert/update karega
app.post("/save-location", async (req, res) => {
  // Log bhi India time me
  const indiaLogTime = new Date().toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: true
  }); // [web:82][web:90]

  console.log("API HIT at (IST)", indiaLogTime, "body:", req.body);

  try {
    const filter = { name: "current" }; // collection me bas ek hi doc "current" naam se

    // Current India time (IST) string, e.g. "12/12/2025, 4:07:30 pm"
    const indiaTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true
    }); // [web:82][web:98]

    const update = {
      $set: {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        time: indiaTime
      }
    };

    // upsert: true => agar 'current' nahi hai to ek baar create, baad me hamesha update
    await Location.updateOne(filter, update, { upsert: true }); // [web:66][web:76]

    res.json({ success: true });
  } catch (err) {
    console.log("DB save error:", err);
    res.json({ success: false, error: err.message });
  }
});

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
