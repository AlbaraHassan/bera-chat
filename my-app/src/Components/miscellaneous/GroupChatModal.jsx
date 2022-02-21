import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../../Context/charProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [ groupChatName, setGroupChatName ] = useState();
    const [ selectedUsers, setSelectedUsers ] = useState([]);
    const [ search, setSearch ] = useState("");
    const [ searchResult, setSearchResult ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const toast = useToast();

    const { user, chats, setChats } = ChatState();
    const token = user.token



    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                position: "bottom"
            });
            return;
        }
        setSelectedUsers([ ...selectedUsers, userToAdd ]);
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter(selected => {
            return selected._id !== delUser._id
        }));
    }

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
                    Authorization: `Bearer ${token}`
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

    }

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                position: "bottom"
            });
            return;
        }

        try {
            const config = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post("/api/chat/group",
                {
                    name: groupChatName,
                    userList: JSON.stringify(selectedUsers.map(user => user._id))
                }, config)
            console.log(data);
            setChats([data, ...chats]);
            onClose();
            toast({
                title: "New group chat created 🥳",
                status: "success",
                duration: 5000,
                position: "bottom"
            });
        } catch (err) {
            toast({
                title: `Error: ${err.message}`,
                status: "error",
                duration: 5000,
                position: "bottom"
            });
            return;
        }

    }

    return (<>

        <span onClick={onOpen}>{children}</span>
        <Modal
            isCentered
            onClose={onClose}
            isOpen={isOpen}
            motionPreset='slideInBottom'

        >
            <ModalOverlay />
            <ModalContent bg={"#FFFAF0"} borderRadius={"3xl"} p={5}>
                <ModalHeader fontSize={"34px"} fontFamily={"monospace"} d={"flex"} justifyContent={"center"}>Create Group Chat</ModalHeader>
                <ModalCloseButton />
                <ModalBody d={"flex"} flexDir={"column"} alignItems={"center"}>
                    <FormControl>
                        <Input placeholder={"Chat Name"} mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <Input placeholder="Add Users 👉 example: Bera, Kera..." mb={1} onChange={(e) => handleSearch(e.target.value)}></Input>
                    </FormControl>
                    <Box w={"100%"} d={"flex"} flexWrap={"wrap"}>
                        {selectedUsers.map(user => {
                            return <UserBadgeItem key={user._id} user={user} handleFunction={() => { handleDelete(user) }} />
                        })}
                    </Box>
                    {loading ? <Spinner /> : searchResult?.slice(0, 5).map(user => {
                        return <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                    })}

                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blackAlpha' mr={3} onClick={handleSubmit}>
                        Create Chat
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    </>);
};

export default GroupChatModal;
