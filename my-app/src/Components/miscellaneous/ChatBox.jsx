import { Box } from '@chakra-ui/react';
import React from 'react';
import { ChatState } from '../../Context/charProvider';
import SingleChat from '../SingleChat';

const ChatBox = ({fetchAgain, setFetchAgain}) => {
    const { selectedChat } = ChatState();
    return (
        <>
        <Box d={{base:selectedChat? "flex" : "none", md:"flex"}} alignItems={"center"} flexDir={"column"} p={3} bg={"white"} w={{base: "100%", md: "69%"}} borderRadius={"xl"} h={"95%"} bg={"#FFFAF0"}>
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        </Box>
        </>);
};

export default ChatBox;
