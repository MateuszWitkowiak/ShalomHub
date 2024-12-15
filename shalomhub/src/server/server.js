// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./api/auth");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB
mongoose.connect("mongodb+srv://boskiraptor2:oFocmXHWMq3zDsjo@cluster0.1nr7u.mongodb.net/")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Routes
app.use("/api", authRoutes);

// Start serwera
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
