import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [user, setuser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const history = useHistory();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setuser(userInfo);

        if(userInfo === undefined){
            history.push("/");
        }

    }, [history]);
    

    return (
        <ChatContext.Provider value={{user, setuser, selectedChat, setSelectedChat, chats, setChats, notifications, setNotifications }}>
            {children}
        </ChatContext.Provider>
    )
};

export const ChatState = () => {
    return useContext(ChatContext);
};


export default ChatProvider;