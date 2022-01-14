const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true},
    password: {type: String, required: true},
    profilePic: {type: String, required: true, default: "https://icon-library.com/images/lion-595b40b75ba036ed117d858a.svg.svg"}
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;