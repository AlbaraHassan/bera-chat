const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profilePic: {type: String, default: "https://icon-library.com/images/lion-595b40b75ba036ed117d858a.svg.svg"}
}, {timestamps: true});

userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
};

userSchema.pre("save", async function(next) { 
//Used a regular function because i had to use this in it
    if(!this.isModified){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;