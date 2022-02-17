import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/charProvider';
import { Box, Text, IconButton, Spinner, Input, FormControl, useToast } from '@chakra-ui/react';
import { ArrowBackIcon, ChatIcon } from "@chakra-ui/icons"
import { getSender, getSenderFull } from "../config/ChatLogic"
import ProfileModal from "../Components/miscellaneous/ProfileModal"
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import "./styles.css"
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const { user, selectedChat, setSelectedChat } = ChatState();
    const [ messages, setMessages ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ newMessage, setNewMessage ] = useState("");
    const [ socketConnected, setSocketConnected ] = useState(false);
    const [ istyping, setIstyping ] = useState(false);
    const [ typing, setTyping ] = useState(false);
    const [ sent, setSent ] = useState(false);
    const toast = useToast()


    const sendMessage = async (event) => {

        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
            setSent(true);
            setNewMessage("");
            try {
                const config = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatid: selectedChat._id
                }, config)

                console.log(data);
                socket.emit("new message", data);
                setMessages([ ...messages, data ]);
                setSent(false);
            } catch (err) {
                toast({
                    title: `Error: ${err.message}`,
                    status: "error",
                    duration: 5000,
                    position: "bottom"
                });
            }

        }

    }

    const typingHandler = async (msg) => {
        setNewMessage(msg.target.value);

        if (!socketConnected) return;
        
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        setTimeout(() => {
            
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            
        }, 3000)
        
    }

    const fetchMessages = async () => {
        if (!selectedChat) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)
            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);
        } catch (err) {
            toast({
                title: `Error: ${err.message}`,
                status: "error",
                duration: 5000,
                position: "bottom"
            });
            setLoading(false);
        }
    };


    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIstyping(true));
        socket.on("stop typing", () => setIstyping(false));

    }, [])

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat
    }, [ selectedChat ]);



    useEffect(() => {
        socket.on("message recieved", (message) => {
            if (!selectedChatCompare || selectedChatCompare._id !== message.chat._id) {
                //give notification
            } else {
                setMessages([ ...messages, message ]);
            }
        });

    })


    return (<>
        {selectedChat ? (<>
            <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} w={"100%"} fontFamily={"monospace"} d={"flex"} justifyContent={{ base: "space-between" }} alignItems={"center"}>
                <IconButton d={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />
                {!selectedChat.isGroupChat ? (
                    <>
                        {getSender(user, selectedChat.userList)}
                        <ProfileModal user={getSenderFull(user, selectedChat.userList)} />
                    </>) : (
                    <>
                        {selectedChat.chatName.toUpperCase()}
                        {<UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />}
                    </>
                )}
            </Text>
            <Box d={"flex"} flexDir={"column"} justifyContent={"flex-end"} p={3} bg={"#E8E8E8"} w={"100%"} h={"100%"} borderRadius={"xl"} boxShadow={"inner"} overflowY={"hidden"}>
                {loading ? <Spinner size={"xl"} w={20} h={20} alignSelf={"center"} margin={"auto"} /> : <div className="messages" >

                    <ScrollableChat messages={messages} />
                </div>}
                <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                    <Box background={"blackAlpha.500"} color={"white"} borderRadius={"3xl"} w={"38%"} p={istyping? 1:0}>
                    {istyping ?   <Text ml={4}><ChatIcon m={1}/>Someone is typing...</Text> : <></>}
                    </Box>
                    <Input variant={"filled"} bg={"#FFFAF0"} placeholder={"Send a Message"} value={newMessage} onChange={typingHandler} isDisabled={sent ? true : false} />
                </FormControl>
            </Box>
        </>) : <Box d={"flex"} alignItems={"center"} justifyContent={"center"} h={"100%"}>
            <Text fontSize={"3xl"} pb={"3"} fontFamily={"monospace"}>
                Choose a Contact
            </Text>
        </Box>}
    </>);
};

export default SingleChat;
