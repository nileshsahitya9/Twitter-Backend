const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    caption: {
        type: String,
        required: [true, "Please enter the caption"],
        trim: true,
    },

    files: {
        type: [String]
    },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    likesCount: {
        type: Number,
        default: 0,
    }
}, {

    timestamps: true

});

module.exports = mongoose.model("Tweet", TweetSchema);