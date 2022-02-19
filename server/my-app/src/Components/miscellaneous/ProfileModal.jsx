import { ViewIcon } from '@chakra-ui/icons';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    IconButton,
    Image,
    Text,
} from '@chakra-ui/react'
import React from 'react';

const ProfileModal = ({user, children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            {children? <span onClick={onOpen}>{children}</span> : 
            <IconButton d={{base: "flex"}} icon={<ViewIcon/>} onClick={onOpen} />}
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset='slideInBottom'
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent h={"420px"} ontSize={"34px"} fontFamily={"monospace"} d={"flex"} justifyContent={"center"}  bg={"#FFFAF0"} borderRadius={"3xl"} p={5}>
          <ModalHeader fontSize={"40px"} fontFamily={"monospace"} d="flex" justifyContent={"center"}>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir={"column"} alignItems={"center"} justifyContent={"space-between"}>
              <Image borderRadius={"full"} boxSize={"150px"} src={user.picture} alt={user.name}/>
              <Text fontSize={{base: "28px", md: "30px"}} fontFamily={"monospace"}>
                    Email: {user.email}
              </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blackAlpha' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    );
};

export default ProfileModal;
