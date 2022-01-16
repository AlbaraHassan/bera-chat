import React from 'react'
import { VStack } from "@chakra-ui/layout"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useState } from "react";
import { Button, useToast } from '@chakra-ui/react'

const SignUp = () => {
    const [show, setshow] = useState(false);
    const [name, setname] = useState();
    const [email, setemail] = useState();
    const [password, setpassword] = useState();
    const [confirmpassword, setconfirmpassword] = useState();
    const [pic, setpic] = useState();
    const [loading, setloading] = useState(false)
    const toast = useToast()

    const handleShow = () => setshow(!show);
    const postDetails = (pic) => {
        setloading(true);
        if(pic.type === undefined){
            toast({
                title: 'Please select an image !!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top-right"
              });
              return;
        };

        if( pic.type ==="image/jpeg" || pic.type ==="image/jpg" || pic.type ==="image/png"){
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "berachat");
            fetch("https://api.cloudinary.com/v1_1/dgweglvnu/image/upload", {
                method: "POST",
                body: data
            }).then(res => res.json()/* or 👉 {return res.json()} */ ).then(data => {
                setpic(data.url.toString());
                console.log(data.url.toString());
                setloading(false);
            }).catch(err => {
                console.log(err);
                setloading(false);
            });
        } else {
            toast({
                title: 'Please select an image !!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top-right"
              });
              setloading(false);
              return;
        }

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

            <Button colorScheme={"blue"} width={"100%"} style={{marginTop: 15}} onClick={submitHandler} isLoading={loading}>Sign Up</Button>

        </VStack>
    )
}

export default SignUp;
