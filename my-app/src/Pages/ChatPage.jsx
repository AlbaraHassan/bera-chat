import React, { useEffect, useState } from 'react';
import axios from "axios"
import { ChatState } from '../Context/charProvider';
import TopDrawer from "../Components/miscellaneous/TopDrawer"
import { Box } from "@chakra-ui/react"
import MyChats from '../Components/miscellaneous/MyChats';
import ChatBox from '../Components/miscellaneous/ChatBox';


const ChatPage = () => {
    const { user } = ChatState();
    const [ fetchAgain, setFetchAgain ] = useState(false);
    useEffect(() => {
        document.body.style.overflow = "hidden";
      }, []);


    return (
        <div style={{ width: "100%" }}>
            {user && <TopDrawer />}
            <Box d="flex" justifyContent={"space-between"} w="100%" h="100vh" p="10px" >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}

export default ChatPage;