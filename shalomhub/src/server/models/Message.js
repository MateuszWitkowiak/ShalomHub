const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

// Dodanie przed-zapisowej walidacji -- błąd z typami 
messageSchema.pre("save", function (next) {
    if (!this.sender || !this.receiver || !this.text) {
        return next(new Error("Brakuje wymaganych pól w wiadomości."));
    }
    next();
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
