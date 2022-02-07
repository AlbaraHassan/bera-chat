const express = require('express');
const dotenv = require('dotenv');
const { chats } = require('./data/data');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require("./routes/chatRoutes")
const { notFound, errorHandler } = require('./middleware/errorMiddleWare')


const app = express();

dotenv.config();

app.use(express.json());

connectDB();
const PORT = process.env.PORT || 5000


app.listen(PORT, () => console.log(`Server started on port ${PORT}`.magenta.bold));


app.get("/", (req, res) => {
    res.send("API is runnings");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler)
