const express = require('express');
const dotenv = require('dotenv');
const { chats } = require('./data/data');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require("./routes/chatRoutes")
const { notFound, errorHandler } = require('./middleware/errorMiddleWare')
const messageRoutes = require("./routes/messageRoutes")
const path = require("path")


const app = express();

dotenv.config();

app.use(express.json());

connectDB();
const PORT = process.env.PORT || 5000








app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);



if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/my-app/build")))

    app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "my-app", "build", "index.html"))
  );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, console.log(`Server started on port ${PORT}`.magenta.bold));

const io = require("socket.io")(server, {
    pingTimeOut: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on("connection", (socket) => {


    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User join the room " + room);
    });

    socket.on("leave chat", (room) => {
        socket.leave(room);
        console.log("LEFT " + room);
    });



    socket.on("new message", (message) => {
        let chat = message.chat;
        if (!chat.userList) return console.log("chat.userList not defined");
        chat.userList.forEach(user => {
            if (user._id == message.sender._id) return;
            socket.in(user._id).emit("message recieved", message);
        })
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.off("setup", () => {
        console.log("DISCONNECTED");
        socket.leave(userData._id)
    })


})