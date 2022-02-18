import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getSender } from '../../config/ChatLogic';
import { ChatState } from '../../Context/charProvider';
import ChatLoading from './ChatLoading';
import GroupChatModal from './GroupChatModal';
import NotificationBadge from "react-notification-badge"
import {Effect} from "react-notification-badge"


const MyChats = ({ fetchAgain }) => {
    const { user, selectedChat, setSelectedChat, chats, setChats, notifications, setNotifications } = ChatState();
    const [ loggedUser, setLoggedUser ] = useState();
    const toast = useToast();
    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get("/api/chat", config);
            console.log(data);
            setChats(data);

        } catch (err) {
            toast({
                title: `Error: ${err.message}`,
                status: "error",
                duration: 5000,
                position: "bottom"
            });

        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
        fetchChats();
    }, [ fetchAgain ]);

    return (
        <Box d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            bg={"#FFFAF0"}
            flexDir={"column"} alignItems={"center"} w={{ base: "100%", md: "30%" }}
            h={"95%"} borderRadius={"xl"} boxShadow={"inner"}>
            <Box pd={3} px={5} py={5} fontSize={{ base: "28px", md: "30px" }} fontFamily={"monospace"} d={"flex"} w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
                Chats
                <GroupChatModal>
                    <Button d={"flex"} fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        colorScheme={"blackAlpha"}
                        rightIcon={<AddIcon />}>
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box d={"flex"} flexDir={"column"} p={3} bg={"#E8E8E8"} w={"100%"} h={"100%"} borderRadius={"xl"} overflowY={"hidden"} boxShadow={"inner"}>
                {chats ? (
                    <Stack overflowY={"scroll"} py={4} px={10}>
                        
                        { chats.map((chat) => {
                            return <Box onClick={() => {
                                setSelectedChat(chat)
                                notifications.map(msg =>{
                                    setNotifications(notifications.filter((m) => m !== msg))
                                })
                            }}
                                cursor={"pointer"} bg={selectedChat === chat ? "#808080" : "#FFFAF0"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3} py={3} borderRadius={"xl"} key={chat._id} boxShadow={selectedChat === chat ? "lg" : "inner"}>
                                <Text>
                                    {!chat.isGroupChat ? getSender(loggedUser, chat.userList) : <Text>{chat.chatName} 🌐</Text>}
                                    {notifications.map((message) => {
                                        if(message.chat._id === chat._id) return <NotificationBadge  count={1} effect={Effect.SCALE}/>
                                    })}

                                </Text>

                            </Box>
                        })}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );

};

export default MyChats;
