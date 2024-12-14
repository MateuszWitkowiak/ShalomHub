const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://boskiraptor2:oFocmXHWMq3zDsjo@cluster0.1nr7u.mongodb.net/")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.post("/api/register", async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error saving user" });
    }
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful" });
});


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
