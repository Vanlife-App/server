const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 2,
        max: 255,
        required: true
    },
    email: {
        type: String,
        min: 3,
        max: 255,
        required: true,
        unique: true
    },
    password: {
        type: String,
        min: 8,
        max: 255,
        required: true
    }
})

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ email: this.email }, process.env.JWT_TOKEN)
}

module.exports = mongoose.model("User", userSchema)