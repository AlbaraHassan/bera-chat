import React from 'react'
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import Login from "../Components/Authentication/Login"
import  SignUp  from "../Components/Authentication/SignUp"

const HomePage = () => {
    return (
        <Container maxW="xl" centerContent>
            <Box d="flex"
                justifyContent="center"
                p={3}
                bg={"White"}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px">
                <Text fontSize="2xl"
                    fontFamily="Work sans"
                    color="Black">Bera Chat</Text>
            </Box>

            <Box bg="White"
                w="100%"
                p={4}
                borderRadius="lg"
                borderWidth="1px">
                <Tabs isFitted variant='enclosed' colorScheme={"purple"}>
                    <TabList mb='1em'>
                        <Tab>Login</Tab>
                        <Tab>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login/>
                        </TabPanel>
                        <TabPanel>
                            <SignUp/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
};

export default HomePage
