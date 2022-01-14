import React from 'react'
import { VStack } from "@chakra-ui/layout"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useState } from "react";
import { Button } from '@chakra-ui/react'

const SignUp = () => {
    const [show, setshow] = useState(false);
    const [name, setname] = useState();
    const [email, setemail] = useState();
    const [password, setpassword] = useState();
    const [confirmpassword, setconfirmpassword] = useState();
    const [pic, setpic] = useState();
    const handleShow = () => setshow(!show);
    const postDetails = (pics) => {

    };
    
    const submitHandler = () => {};


    return (
        <VStack spacing={"5px"}>
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder={"Enter Your Name"}
                    onChange={(e) => { setname(e.target.value) }} />

            </FormControl>

            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder={"Enter Your Email"}
                    onChange={(e) => { setemail(e.target.value) }} />

            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show? "text" : "password"} placeholder={"Enter Your Password"}
                        onChange={(e) => { setpassword(e.target.value) }} />
                    <InputRightElement>
                        <Button h="1.75rem" size="xs" variant="ghost" onClick={handleShow}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>



            </FormControl>

            <FormControl id="confirmpassword" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show? "text" : "password"} placeholder={"Enter Your Password again"}
                        onChange={(e) => { setconfirmpassword(e.target.value) }} />
                    <InputRightElement>
                        <Button h="1.75rem" size="xs" variant="ghost" onClick={handleShow}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>

                <FormControl id="pic">
                    <FormLabel>Profile Picture</FormLabel>
                    <Input 
                    type={"file"} p={1.5} accept="image/*" onChange={(e) => postDetails(e.target.files[0])}/>
                </FormControl>

            

            </FormControl>

            <Button colorScheme={"blue"} width={"100%"} style={{marginTop: 15}} onClick={submitHandler}>Sign Up</Button>

        </VStack>
    )
}

export default SignUp;
