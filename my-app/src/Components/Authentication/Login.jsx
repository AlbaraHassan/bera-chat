import React from 'react'
import { VStack } from "@chakra-ui/layout"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input"
import { useState } from "react"
import { Button } from '@chakra-ui/react'

const Login = () => {
    const [show, setshow] = useState(false);
    const [email, setemail] = useState();
    const [password, setpassword] = useState();
    const handleShow = () => setshow(!show);
    const submitHandler = () => { };


    return (
        <VStack spacing={"5px"}>

            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder={"Enter Your Email"}
                    onChange={(e) => { setemail(e.target.value) }} />

            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} placeholder={"Enter Your Password"}
                        onChange={(e) => { setpassword(e.target.value) }} />
                    <InputRightElement>
                        <Button h="1.75rem" size="xs" variant="ghost" onClick={handleShow}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>



            </FormControl>

            <Button colorScheme={"blackAlpha"} width={"100%"} style={{ marginTop: 15 }} onClick={submitHandler}>Login</Button>
            <Button colorScheme={"blackAlpha"} variant= "outline" width={"100%"} style={{ marginTop: 15 }} onClick={() => { setemail("guest@guest.com"); setpassword("12345678") }}>Guest User</Button>

        </VStack>
    )
}

export default Login;
