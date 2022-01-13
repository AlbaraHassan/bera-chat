const express = require('express');
const dotenv = require('dotenv');
const { chats } = require('./data/data');


const app = express()

dotenv.config()
const PORT = process.env.PORT || 5000


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


app.get("/", (req, res) => {
    res.send("API is runnings");
});

app.get("/api/chats", (req, res) => {
    res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
    const singleChat = chats.find((s) => s._id = req.params.id);
    res.send(singleChat);
});