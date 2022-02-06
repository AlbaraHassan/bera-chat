import React from 'react'
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel, Collapse } from "@chakra-ui/react"
import { useDisclosure } from '@chakra-ui/react'
import Login from "../Components/Authentication/Login"
import  SignUp  from "../Components/Authentication/SignUp"

const HomePage = () => {
    const { isOpen, onToggle } = useDisclosure()
    return (
        <Container maxW="3xl" centerContent>
            <Box d="flex"
                justifyContent="center"
                p={5}
                bg={"White"}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="3xl"
                borderWidth="1px"
                bg={"#FFFAF0"}
                boxShadow={"inner"}>
                <Text fontSize="5xl"
                    fontFamily="monospace"
                    fontWeight={"thin"}
                    color="Black">Bera Chat</Text>
            </Box>

            <Box bg="White"
                w="100%"
                p={5}
                borderRadius="3xl"
                borderWidth="1px"
                bg={"#FFFAF0"}
                boxShadow={"inner"}>
                <Tabs isFitted variant='enclosed' colorScheme={"blackAlpha"}>
                    <TabList mb='1em'>
                        <Tab onClick={onToggle} isDisabled={isOpen?false:true} >Login</Tab>
                        <Tab onClick={onToggle} isDisabled={isOpen?true:false}>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Collapse in={!isOpen} animateOpacity >
                            <Login/>
                            </Collapse>
                        </TabPanel>
                        <TabPanel>
                        <Collapse in={isOpen} animateOpacity>
                            <SignUp/>
                        </Collapse>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
};

export default HomePage
