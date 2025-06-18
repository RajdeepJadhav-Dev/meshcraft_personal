const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    profilePicture: {
        type: String, 
        default: "", 
      },
      discordId:{
        type: String,
        unique: true,
      },
      discordUsername:{
        type: String,
      },
      discordAvatar:{
        type: String,
      },
      
    
      resetPasswordToken: { type: String },
      resetPasswordExpires: { type: Date },
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);