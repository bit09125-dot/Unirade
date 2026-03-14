const mongoose = require("mongoose");

const UserSchema = new mongoose.Schea({
name: String,
email: String,
password: String,

isPremium: {
type: Boolean,
default: false
},

premiuimUntil: Date

});

module.exports = mongoose.model("User", UserSchema);
