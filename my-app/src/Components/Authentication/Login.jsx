import React from 'react'
import { VStack } from "@chakra-ui/layout"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input"
import { useState } from "react"
import { Button, useToast } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    const [show, setshow] = useState(false);
    const [email, setemail] = useState();
    const [password, setpassword] = useState();
    const [loading, setloading] = useState(false);
    const handleShow = () => setshow(!show);
    const toast = useToast();
    const history = useHistory();
    const submitHandler = async() => {
        setloading(true);
        if (!email || !password){
            toast({
                title: "Please fill the fields",
                status: "error",
                duration: 5000,
                position: "top-right"
            });
            setloading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            };
            const { data } = await axios.post("/api/user/login", {email, password}, config);
            const name = data.name

            toast({
                title: `Welcome ${name}`,
                status: "success",
                duration: 5000,
                position: "top-right"
            });
            localStorage.setItem("userInfo", JSON.stringify(data))
            setloading(false);
            history.push("/chats");

        }catch (err){
            toast({
                title: `ERROR: ${err.resoponse.data.message}`,
                status: "error",
                duration: 5000,
                position: "top-right"
            });
            setloading(false); 
        }
    };


    return (
        <VStack spacing={"5px"}>

            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder={"Enter Your Email"}
                    onChange={(e) => { setemail(e.target.value) }} value={email} />

            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} placeholder={"Enter Your Password"}
                        onChange={(e) => { setpassword(e.target.value) }} value={password}/>
                    <InputRightElement>
                        <Button h="1.75rem" size="xs" variant="ghost" onClick={handleShow} isLoading={loading}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>



            </FormControl>

            <Button colorScheme={"blackAlpha"} width={"100%"} style={{ marginTop: 15 }} onClick={submitHandler}>Login</Button>
            <Button colorScheme={"blackAlpha"} variant= "outline" width={"100%"} style={{ marginTop: 15 }} onClick={() => { setemail("guest@guest.com"); setpassword("guest"); submitHandler(); } }>Guest User</Button>

        </VStack>
    )
}

export default Login;
