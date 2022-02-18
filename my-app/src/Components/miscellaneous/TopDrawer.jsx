import { Avatar, Box, Button, Center, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, effect, HStack, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, toast, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import React, { useState } from 'react';
import { ChatState } from '../../Context/charProvider';
import ProfileModal from "./ProfileModal"
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogic';
import {Effect} from "react-notification-badge"
import NotificationBadge from "react-notification-badge"


const SideDrawer = () => {
    const [ search, setsearch ] = useState("");
    const [ searchResult, setsearchResult ] = useState([]);
    const [ loading, setloading ] = useState(false);
    const [ loadingChat, setloadingChat ] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { user, setSelectedChat, chats, setChats, notifications, setNotifications } = ChatState();
    const toast = useToast();

    const history = useHistory();
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };

    const handleSearch = async() => {
        if (!search){
            toast({
                title: "Nothing was entered in search",
                status: "warning",
                duration: 5000,
                position: "bottom"
            });
            return;
        };
        try {
            setloading(true);
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            };
            const {data} = await axios.get(`/api/user?search=${search}`, config);
            setloading(false);
            setsearchResult(data);
        } catch (err) {
            toast({
                title: `Error: ${err.message}`,
                status: "error",
                duration: 5000,
                position: "bottom"
            });
            setloading(false);
        }
    };
    const accessChat = async (userid) => {
        console.log(userid);
        try {
            setloadingChat(true);
            const config = {
                headers:{
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };
            
            const {data} = await axios.post(`/api/chat`, {userid} , config);
            console.log(data);
            if(!chats.find(c => c._id === data._id)) setChats([data, ...chats])
            setSelectedChat(data);
            setloadingChat(false);
            onClose();


        } catch (err) {
            toast({
                title: `Error: ${err.message}`,
                status: "error",
                duration: 5000,
                position: "bottom"
            });
            setloadingChat(false);
        }
    };

    return (<>
    
        <Box d="flex" justifyContent={"space-between"} alignItems={"center"} bg={"#FFFAF0"} w={"100%"} p="5px 10px 5px 10px" borderRadius="3xl" boxShadow={"inner"}>
            <Tooltip label={"Search Users"} hasArrow placement={"bottom"}>
                <Button variant={"ghost"} colorScheme={"blackAlpha"} onClick={onOpen}>
                    <i className="fas fa-search"></i>
                </Button>

            </Tooltip>

            <Text fontSize={"2xl"} fontFamily={"monospace"}>Bera Chat</Text>
            <div>
                <Menu>
                    <MenuButton p="1">
                        <NotificationBadge count={notifications.length} effect={Effect.SCALE}/>
                        <BellIcon fontSize={"xl"} m={1} />
                    </MenuButton>
                    <MenuList pl={2}>
                        {!notifications.length ? "No new messages" : ""}
                        {notifications.map((msg)=>{
                            return <MenuItem key={notifications._id} onClick={() => {
                                setSelectedChat(msg.chat);
                                setNotifications(notifications.filter((m) => m !== msg))
                            }}>
                                {msg.chat.isGroupChat? `New message in ${msg.chat.chatName}` : `${getSender(user, msg.chat.userList)} sent a message` }
                            </MenuItem>
                        })}
                    </MenuList>
                </Menu>
                <Menu >
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg={"#FFFAF0"}>
                        <Avatar size={"sm"} cursor={"pointer"} name={user.name} src={user.picture} />
                    </MenuButton>
                    <MenuList bg={"#FFFAF0"}>
                        <ProfileModal user={user}>
                            <MenuItem>My Profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider />
                        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box>

        <Drawer placement="top" onClose={onClose} isOpen={isOpen} >
            <DrawerOverlay />
            <DrawerContent bg={"#FFFAF0"} borderRadius={"3xl"} w={"50%"} marginLeft={"25%"} >
                <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
                <DrawerBody>
                    <Box d="flex" p={2}  >
                        <Input placeholder={"Search by name"} mr={2} value={search} onChange={(e) => {
                            setsearch(e.target.value)
                        }}></Input>
                        <Button onClick={handleSearch} colorScheme={"blackAlpha"}>Search</Button>
                    </Box>
                    {loading? (
                        <ChatLoading/>
                    ) : (
                        searchResult?.map((user)=>(
                         <UserListItem key={user._id} user={user}  handleFunction={() => accessChat(user._id)}/>
                         ))
                    )}
                    {loadingChat && <Spinner ml="auto" d="flex" />}
                </DrawerBody>
            </DrawerContent>

        </Drawer>
    </>
    );
};

export default SideDrawer;
