import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../../Context/charProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedChat, setSelectedChat, user } = ChatState();
    const [ groupChatName, setGroupChatName ] = useState();
    const [ search, setSearch ] = useState("");
    const [ searchResult, setSearchResult ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ renameLoading, setRenameLoading ] = useState(false);

    const handleRemove = async(remUser) => {
        if (selectedChat.groupAdmin._id !== user._id && remUser._id !== user._id){
            toast({
                title: "You are not authorized!",
                status: "warning",
                duration: 5000,
                position: "bottom"
            }); 
            return;
        }

        try {
            setLoading(true);
            const config = {
                method: "PUT",
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }
            const {data} = await axios.put("/api/chat/groupremove", {
                chatid: selectedChat._id,
                userid: remUser._id
            }, config)

            remUser._id === user._id ? setSelectedChat() : setSelectedChat(data); 
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
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

    const handleRename = async () => {
        if (!groupChatName) {
            return;
        }
        try {
            setRenameLoading(true);
            const config = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }


            const { data } = await axios.put("/api/chat/rename", {
                chatid: selectedChat._id,
                chatName: groupChatName
            }, config)
            console.log(data);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);

        } catch (err) {
            toast({
                title: `Error: ${err.message}`,
                status: "error",
                duration: 5000,
                position: "bottom"
            });
            setRenameLoading(false);
            setGroupChatName("");
        }
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        };

        try {
            setLoading(true);
            const config = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            console.log(data);

            setLoading(false);
            setSearchResult(data);
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

    const handleAddUser = async (userToAdd) => {
        if (selectedChat.userList.find((user) => userToAdd._id === user._id)){
            toast({
                title: "User is already in the group",
                status: "warning",
                duration: 5000,
                position: "bottom"
            }); 
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "You are not authorized!",
                status: "warning",
                duration: 5000,
                position: "bottom"
            }); 
            return;
        }

        try {
            setLoading(true);
            const config = {
                method: "PUT",
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }
            const {data} = await axios.put("/api/chat/groupadd", {
                chatid: selectedChat._id,
                userid: userToAdd._id
            }, config)

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
            
        } catch (err) {
            toast({
                title: `Error: ${err.message}`,
                status: "error",
                duration: 5000,
                position: "bottom"
            });
            setLoading(false);
        
        }

    }

    return (<>
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen}></IconButton>
        <Modal
            isCentered
            onClose={onClose}
            isOpen={isOpen}
            motionPreset='slideInBottom'
        >
            <ModalOverlay />
            <ModalContent bg={"#FFFAF0"} borderRadius={"3xl"} p={5}>
                <ModalHeader fontSize={"34px"} fontFamily={"monospace"} d={"flex"} justifyContent={"center"}>{selectedChat.chatName}</ModalHeader>
                <ModalCloseButton />
                <ModalBody d={"flex"} flexDir={"column"} alignItems={"center"}>
                    <Box w={"100%"} d={"flex"} flexWrap={"wrap"}>
                        {selectedChat.userList.map((user) => {
                            return <UserBadgeItem key={user._id} user={user} handleFunction={() =>  {handleRemove(user)}} />
                        })}
                    </Box>
                    <FormControl d="flex">
                        <Input placeholder="Change Group Name" mb={1} onChange={(e) => setGroupChatName(e.target.value)} />
                        <Button colorScheme={"blackAlpha"} ml={1} isLoading={renameLoading} onClick={handleRename}>Update</Button>
                    </FormControl>
                    <FormControl>
                        <Input placeholder="Add Users 👉 example: Bera, Kera..." mb={1} onChange={(e) => handleSearch(e.target.value)}></Input>
                    </FormControl>

                    {loading ? <Spinner /> : searchResult?.slice(0, 5).map(user => {
                        return <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)}/>
                    })}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => handleRemove(user)} colorScheme={"red"}>Leave Group</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    </>);
};

export default UpdateGroupChatModal;
