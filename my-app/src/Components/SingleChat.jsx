import React from 'react';
import { ChatState } from '../Context/charProvider';
import { Box, Text, IconButton } from '@chakra-ui/react';
import {ArrowBackIcon} from "@chakra-ui/icons"
import {getSender, getSenderFull} from "../config/ChatLogic"
import  ProfileModal from "../Components/miscellaneous/ProfileModal"
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';


const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const { user, selectedChat, setSelectedChat } = ChatState();


    return (<>
        {selectedChat ? (<>
            <Text fontSize={{base:"28px", md:"30px"}} pb={3} px={2} w={"100%"} fontFamily={"monospace"} d={"flex"} justifyContent={{base: "space-between"}} alignItems={"center"}>
                <IconButton  d={{base:"flex", md:"none"}} icon={<ArrowBackIcon/>} onClick={()=> setSelectedChat("")}/>
                {!selectedChat.isGroupChat ? (
                <>
                    {getSender(user, selectedChat.userList)}
                    <ProfileModal user={getSenderFull(user, selectedChat.userList)}/>
                </>) : (
                    <>
                    {selectedChat.chatName.toUpperCase()}
                    {<UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
                    </>
                    )}
            </Text>
            <Box d={"flex"} flexDir={"column"} justifyContent={"flex-end"} p={3} bg={"#E8E8E8"} w={"100%"} h={"100%"} borderRadius={"xl"} boxShadow={"inner"} overflowY={"hidden"}>
                {/* Messages here */}
            </Box>
        </>) : <Box d={"flex"} alignItems={"center"} justifyContent={"center"} h={"100%"}>
            <Text fontSize={"3xl"} pb={"3"} fontFamily={"monospace"}>
                Choose a Contact
            </Text>
        </Box>}
    </>);
};

export default SingleChat;
