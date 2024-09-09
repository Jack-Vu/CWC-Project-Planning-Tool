import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Context } from "../App";

const LogIn = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const context = useOutletContext() as Context;

  const [show, setShow] = useState(false);
  const handleShowHideClick = () => setShow(!show);
  const [signUpForm, setSignUpForm] = useState({
    username: "",
    password: ""
  });
  const [submitClicked, setSubmitClicked] = useState({
    username: false,
    password: false
  });
  const isUsernameError = signUpForm.username === "" && submitClicked.username;
  const isPasswordError = signUpForm.password === "" && submitClicked.password;

  const handleChangeForm = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubmitClicked({
      ...submitClicked,
      [name]: false
    });
    setSignUpForm({
      ...signUpForm,
      [name]: value
    });
  };

  const onSubmit = () => {
    setSubmitClicked({
      username: true,
      password: true
    });
    if (signUpForm.username === "" || signUpForm.password === "") {
      return;
    } else {
      axios
        .post("http://localhost:3025/auth/log-in", {
          username: signUpForm.username,
          password: signUpForm.password
        })
        .then((response) => {
          const token = response.data;
          context.toggledLoggedIn();
          localStorage.setItem("token", token);
          setSignUpForm({
            username: "",
            password: ""
          });
          setSubmitClicked({
            username: false,
            password: false
          });
          navigate("/projects");
          toast({
            title: "Account created.",
            description: `Welcome back, ${signUpForm.username}.`,
            status: "success",
            duration: 3000,
            isClosable: true
          });
        })
        .catch((error) => {
          setSignUpForm({
            username: "",
            password: ""
          });
          setSubmitClicked({
            username: false,
            password: false
          });
          toast({
            title: "Error.",
            description:
              "There was an error logging you into your account. Please try again!",
            status: "error",
            duration: 3000,
            isClosable: true
          });
        });
    }
  };

  return (
    <>
      <Text textAlign="center" mb={4} fontSize="20px">
        Log In Your Account
      </Text>
      <Box
        maxW="75%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        margin="0 auto"
        gap={4}
      >
        <FormControl isRequired isInvalid={isUsernameError}>
          <FormLabel>Username: </FormLabel>
          <Input
            onChange={handleChangeForm}
            name="username"
            type="text"
            value={signUpForm.username}
          />
          {isUsernameError && (
            <FormErrorMessage>Username is required.</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={isPasswordError}>
          <FormLabel>Password: </FormLabel>
          <InputGroup size="md">
            <Input
              onChange={handleChangeForm}
              name="password"
              type={show ? "text" : "password"}
              value={signUpForm.password}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleShowHideClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          {isPasswordError && (
            <FormErrorMessage>A password is required</FormErrorMessage>
          )}
        </FormControl>
        <Button w="100%" onClick={onSubmit}>
          Submit
        </Button>
        <Box display="flex" alignItems="center" gap={4} marginTop={2}>
          <Text>Forgot your password? </Text>
          <Button>Reset Password</Button>
        </Box>
      </Box>
    </>
  );
};

export { LogIn };
