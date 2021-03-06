const asyncHandler = require('express-async-handler');
const User = require("../Models/userModel");
const {generateToken} = require('../config/generateToken');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, picture } = req.body;
    console.log(name);
    console.log(email);
    console.log(picture);
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Enter all the required fields!");
    };

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists!!");
    };

    const user = await User.create({
        name,
        email,
        password,
        picture
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            password: user.password,
            email: user.email,
            picture: user.picture,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error("Faild to create user")
    };
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            token: generateToken(user._id)
        });
    };

});

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
      
  
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  });

module.exports = { registerUser, authUser, allUsers }