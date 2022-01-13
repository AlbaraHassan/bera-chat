import React, { useEffect } from 'react';
import axios from "axios"

const ChatPage = () => {
    
    const fetchData = async () => {
        const {data} = await axios.get("/api/chats")
        console.log(data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            ChatPage
        </div>
    )
}

export default ChatPage
