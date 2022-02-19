import { Avatar, Text, Tooltip } from '@chakra-ui/react';
import React from 'react';
import ScrollableFeed from "react-scrollable-feed"
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogic';
import { ChatState } from '../Context/charProvider';

const ScrollableChat = ({ messages }) => {
    const {user} = ChatState()
    return (
        <ScrollableFeed>
            {messages && messages.map((message, index) => {
                return <div style={{display: "flex"}} key={message._id}>
                    {
                        (isSameSender(messages, message, index, user._id) || isLastMessage(messages, index, user._id)) && 
                            <Tooltip label={message.sender.name} placement={"bottom-start"} hasArrow>
                                <Avatar mt={"7px"}  mr={1} size={"sm"} cursor={"pointer"} name={message.sender.name} src={message.sender.picture}/>
                            </Tooltip>
                        
                    }
                    <span style={{background: `${message.sender._id === user._id? "#FFFAF0" : "#808080"}`, borderRadius:"20px", padding:"5px 15px", maxWidth: "75%", marginLeft: isSameSenderMargin(messages, message, index, user._id),
                    marginTop: isSameUser(messages, message, index, user._id)? 3: 10}} >
                        <Text textColor={message.sender._id === user._id ? "#808080" : "white"} fontWeight={"semibold"}>
                {message.content}
                </Text>

            </span>
                </div>
            })}
            
        </ScrollableFeed>
    )
};

export default ScrollableChat;
