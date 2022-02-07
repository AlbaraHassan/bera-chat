const expressAsyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");
const accessChat = expressAsyncHandler(async (req, res) => {
    const { userid } = req.body

    if (!userid) {
        console.log("User id not sent with the request");
        return res.status(400);
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { userList: { $elematch: { $eq: req.user._id } } },
            { userList: { $elematch: { $eq: userid } } }
        ],

    }).populate("userList", "-password").populate("latestMessage");
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    })

    if (isChat.length > 0) {
        res.send(isChat[ 0 ])
    } else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            userList: [ req.user._id, userid ]
        }
        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("userList", "-password")
            res.status(200).send(fullChat)
        } catch (err) {
            res.status(400);
            throw new Error(err.message)

        }
    }
});

const fetchChats = expressAsyncHandler(async (req, res) => {
    try {
        Chat.find({ userList: { $eq: req.user._id } }).populate("userList", "-password").populate("groupAdmin", "-password").populate("latestMessage").sort({ updatedAt: -1 }).then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email"
            });
            res.status(200).send(results)
        });
    } catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
});

const createGroupChat = expressAsyncHandler(async (req, res) => {
    if (!req.body.userList || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields" })
    }

    let userList = JSON.parse(req.body.userList)

    if (userList.length < 2) {
        return res.status(400).send({ message: "More than two users are requierd for group chats" })
    }

    userList.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            userList: userList,
            isGroupChat: true,
            groupAdmin: req.user
        })
        const fullGroupChat = await Chat.findOne({ _id: { $eq: groupChat._id } }).populate("userList", "-password").populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat)
    } catch (err) {
        res.status(400);
        throw new Error(err.message);
    }

});

const renameGroup = expressAsyncHandler(async (req, res) => {
    const { chatid, chatName } = req.body
    const updatedChat = await Chat.findByIdAndUpdate(
        chatid, { chatName: chatName }, { new: true }
    ).populate("userList", "-password").populate("groupAdmin", "-password");
    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat not found")
    } else {
        res.json(updatedChat)
    }
});

const addToGroup = expressAsyncHandler(async (req, res) => {
    const { chatid, userid } = req.body
    const added = await Chat.findByIdAndUpdate(chatid,
        {
            $push: { userList: userid }
        }, { new: true }
    ).populate("userList", "-password").populate("groupAdmin", "-password");
    if (!added){
        res.status(400)
        throw new Error("Chat not found")
    } else {
        res.json(added)
    }
});

const removeFromGroup = expressAsyncHandler(async(req, res) => {
    const { chatid, userid } = req.body
    const removed = await Chat.findByIdAndUpdate(chatid,
        {
            $pull: { userList: userid }
        }, { new: true }
    ).populate("userList", "-password").populate("groupAdmin", "-password");
    if (!removed){
        res.status(400)
        throw new Error("Chat not found")
    } else {
        res.json(removed)
    }
});

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup }