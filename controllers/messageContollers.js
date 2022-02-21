const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const Message = require("../Models/messageModel");
const User = require("../Models/userModel");

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatid } = req.body
    if (!content || !chatid) {
        console.log("Invalid data passed through the request");
        return res.sendStatus(400)
    }
    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatid
    }
    try {
        let message = await Message.create(newMessage);
        message = await message.populate("sender", "name picture");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path:"chat.userList",
            select: "name picture email"
        });
        await Chat.findByIdAndUpdate(req.body.chatid, {
            latestMessage: message
        });
        res.json(message)

    } catch (err) {
        res.status(400);
        throw new Error(err.message)
    }


});

const allMessages = asyncHandler(async(req, res) => {
    try {
        const messages = await Message.find(
            {
                chat: req.params.chatid
            }).populate("sender", "name picture email").populate("chat");
            res.json(messages);
    } catch (err) {
        res.status(400);
        throw new Error(err.message)
    }
});


module.exports = {sendMessage, allMessages};