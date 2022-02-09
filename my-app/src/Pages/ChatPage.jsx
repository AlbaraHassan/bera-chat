import React, { useEffect } from 'react';
import axios from "axios"
import { ChatState } from '../Context/charProvider';
import SideDrawer from "../Components/miscellaneous/SideDrawer"
import {Box} from "@chakra-ui/react"
import MyChats from '../Components/miscellaneous/MyChats';
import ChatBox from '../Components/miscellaneous/ChatBox';
import { useHistory } from 'react-router-dom';


const ChatPage = () => {
   const { user } = ChatState();
   



    return (
        <div style={{width: "100%"}}>
            {user && <SideDrawer/>}
            <Box d="flex" justifyContent={"space-between"} w="100%" h="100vh" p="10px" >
                {user && <MyChats/>}
                {user && <ChatBox/>}
            </Box>
        </div>
    )
}

export default ChatPage;