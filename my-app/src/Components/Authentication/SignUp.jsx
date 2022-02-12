import React from 'react';
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useState } from "react";
import { Button, useToast } from '@chakra-ui/react';
import { useHistory } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
    const [ show, setshow ] = useState(false);
    const [ show1, setshow1 ] = useState(false);
    const [ name, setname ] = useState();
    const [ email, setemail ] = useState();
    const [ password, setpassword ] = useState();
    const [ confirmpassword, setconfirmpassword ] = useState();
    const [ pic, setpic ] = useState();
    const [ loading, setloading ] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const handleShow = () => setshow(!show);
    const handleShow1 = () => setshow1(!show1);
    const postDetails = async(pics) => {
        setloading(true);
        if (pics === undefined) {
            toast({
                title: 'Please select an image !!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        };

        if (pics.type === "image/jpeg" || pics.type === "image/jpg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "berachat");
            fetch("https://api.cloudinary.com/v1_1/dgweglvnu/image/upload", {
                method: "POST",
                body: data
            }).then(res => res.json()/* or 👉 {return res.json()} */).then(data => {
                const pic = data.url.toString()
                setpic(pic);
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
                position: "bottom"
            });
            setloading(false);
            return;
        }

    };

    const submitHandler = async () => {
        setloading(true);
        if (!name || !password || !confirmpassword || !email) {
            toast({
                title: "Please fill out the required fields",
                status: "warning",
                duration: 5000,
                position: "bottom"
            });
            setloading(false);
            return;
        };

        if (password !== confirmpassword) {
            toast({
                title: "Passwords do not match",
                status: "error",
                duration: 5000,
                position: "bottom"
            })
            setloading(false);
            return;
        };

        try {
            const config = {
                method:"POST",
                headers: {
                    "Content-type": "application/json"
                }
            };
            const picture = pic
            const { data } = await axios.post("/api/user", {name, email, password, picture}, config)

            toast({
                title: "Regestiration is succesful",
                status: "success",
                duration: 5000,
                position: "bottom"
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setloading(false);
            history.push("/chats");
            
        } catch (err) {
            toast({
                title: `ERROR: ${err.response.data.message}`,
                status: "error",
                duration: 5000,
                position: "bottom"
            });
            setloading(false);
        }

    };

    // this is the same as in line 111
    const showFunction = () => {
        if (show) {
            return "Hide"
        } else {
            return "Show"
        }
    }

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
                    <Input type={show ? "text" : "password"} placeholder={"Enter Your Password"}
                        onChange={(e) => { setpassword(e.target.value) }} />
                    <InputRightElement>
                        <Button h="1.75rem" size="xs" variant="ghost" onClick={handleShow}>
                            {showFunction()}
                        </Button>
                    </InputRightElement>
                </InputGroup>



            </FormControl>

            <FormControl id="confirmpassword" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show1 ? "text" : "password"} placeholder={"Enter Your Password again"}
                        onChange={(e) => { setconfirmpassword(e.target.value) }} />
                    <InputRightElement>
                        <Button h="1.75rem" size="xs" variant="ghost" onClick={handleShow1}>
                            {show1 ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>

                <FormControl id="picture">
                    <FormLabel>Profile Picture</FormLabel>
                    <Input
                        type={"file"} p={1.5} accept="image/*" onChange={(e) => postDetails(e.target.files[ 0 ])} />
                </FormControl>



            </FormControl>

            <Button colorScheme={"blackAlpha"} width={"100%"} style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>Sign Up</Button>

        </VStack>
    )
}

export default SignUp;
