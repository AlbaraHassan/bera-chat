const express = require('express');
const dotenv = require('dotenv');
const { chats } = require('./data/data');
const connectDB = require('./config/db');
const colors = require('colors');


const app = express();

dotenv.config();

connectDB();
const PORT = process.env.PORT || 5000


app.listen(PORT, () => console.log(`Server started on port ${PORT}`.magenta.bold));


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