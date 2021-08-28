const mongoose = require("mongoose");

const RelationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    followersCount: {
        type: Number,
        default: 0,
    },
    followingCount: {
        type: Number,
        default: 0,
    },
    following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
}, {
    timestamps: true
}
);


module.exports = mongoose.model("Relation", RelationSchema);