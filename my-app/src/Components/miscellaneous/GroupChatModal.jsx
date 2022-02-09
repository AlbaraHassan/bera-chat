import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../../Context/charProvider';

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [ groupChatName, setGroupChatName ] = useState();
    const [ selectedUsers, setSelectedUsers ] = useState([]);
    const [ search, setSearch ] = useState("");
    const [ searchResult, setSearchResult ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        };

        try {
            setLoading(true);
            const config = {
                header: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);

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

    const handleSubmit = async () => { }

    return (<>

        <span onClick={onOpen}>{children}</span>
        <Modal
            isCentered
            onClose={onClose}
            isOpen={isOpen}
            motionPreset='slideInBottom'

        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={"34px"} fontFamily={"monospace"} d={"flex"} justifyContent={"center"}>Create Group Chat</ModalHeader>
                <ModalCloseButton />
                <ModalBody d={"flex"} flexDir={"column"} alignItems={"center"}>
                    <FormControl>
                        <Input placeholder={"Chat Name"} mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <Input placeholder="Add Users 👉 example: Bera, Kera..." mb={1} onChange={(e) => handleSearch(e.target.value)}></Input>
                    </FormControl>
                    {/* SELECTED USERS */}
                    {/* RENDER SEARCHED USERS */}
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
