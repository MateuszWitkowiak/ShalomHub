const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./api/auth");
const postRoutes = require("./api/posts")

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://boskiraptor2:oFocmXHWMq3zDsjo@cluster0.1nr7u.mongodb.net/")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

app.use("/api", authRoutes);
app.use("/api/posts", postRoutes)

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
