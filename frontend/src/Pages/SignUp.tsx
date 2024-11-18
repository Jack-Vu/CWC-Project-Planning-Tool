import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Context } from "../App";

export const isInvalidEmail = (email: string) => {
  const emailFormat = /\S+@\S+\.\S+/;
  if (email.match(emailFormat) && email.length > 0) {
    return false;
  } else {
    return true;
  }
};

export const isInvalidSecondPassword = (pass1: string, pass2: string) => {
  return pass1 !== pass2;
};

const SignUp = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const context = useOutletContext() as Context;

  const [show, setShow] = useState(false);
  const [showSecond, setSecondShow] = useState(false);
  const [secondPassword, setSecondPassword] = useState("");
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    username: "",
    password: ""
  });
  const [submitClicked, setSubmitClicked] = useState({
    name: false,
    email: false,
    username: false,
    password: false,
    secondPassword: false
  });

  const isNameError = signUpForm.name === "" && submitClicked.name;
  const isEmailError = isInvalidEmail(signUpForm.email) && submitClicked.email;
  const isUsernameError = signUpForm.username === "" && submitClicked.username;
  const isPasswordError = signUpForm.password === "" && submitClicked.password;
  const isSecondPasswordError =
    (isInvalidSecondPassword(signUpForm.password, secondPassword) &&
      submitClicked.secondPassword) ||
    (signUpForm.password === "" && submitClicked.secondPassword);

  const handleChangeForm = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubmitClicked({
      ...submitClicked,
      [name]: false
    });
    if (name === "secondPassword") {
      setSecondPassword(value);
      return;
    }
    setSignUpForm({
      ...signUpForm,
      [name]: value
    });
  };

  const onSubmit = () => {
    setSubmitClicked({
      name: true,
      email: true,
      username: true,
      password: true,
      secondPassword: true
    });

    if (
      signUpForm.name === "" ||
      isInvalidEmail(signUpForm.email) ||
      signUpForm.username === "" ||
      signUpForm.password === "" ||
      secondPassword === "" ||
      isInvalidSecondPassword(signUpForm.password, secondPassword)
    ) {
      return;
    } else {
      axios
        .post("http://localhost:3025/auth/sign-up", {
          name: signUpForm.name,
          email: signUpForm.email,
          username: signUpForm.username,
          password: signUpForm.password
        })
        .then((response) => {
          const token = response.data;
          context.toggledLoggedIn();
          localStorage.setItem("token", token);
          setSignUpForm({
            name: "",
            email: "",
            username: "",
            password: ""
          });
          setSecondPassword("");
          setSubmitClicked({
            name: false,
            email: false,
            username: false,
            password: false,
            secondPassword: false
          });
          navigate("/projects");
          toast({
            title: "Account created.",
            description: "We've created your account for you.",
            status: "success",
            duration: 3000,
            isClosable: true
          });
        })
        .catch((error) => {
          setSignUpForm({
            name: "",
            email: "",
            username: "",
            password: ""
          });
          setSecondPassword("");
          setSubmitClicked({
            name: false,
            email: false,
            username: false,
            password: false,
            secondPassword: false
          });
          toast({
            title: "Error.",
            description:
              "We were not able to create your account. Please try again!",
            status: "error",
            duration: 3000,
            isClosable: true
          });
        });
    }
  };
  const handleShowHideClick = () => setShow(!show);
  const handleShowHideSecondPasswordClick = () => setSecondShow(!showSecond);

  return (
    <Box mt={20}>
      <Heading layerStyle="heading" mb={4} fontSize={28} textAlign="center">
        Create An Account
      </Heading>
      <Box
        maxW="75%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        margin="0 auto"
        gap={4}
      >
        <FormControl isRequired isInvalid={isNameError}>
          <FormLabel layerStyle="text">Name: </FormLabel>
          <Input
            onChange={handleChangeForm}
            name="name"
            type="text"
            value={signUpForm.name}
            layerStyle="text"
          />
          {isNameError && (
            <FormErrorMessage>Name is required.</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={isEmailError}>
          <FormLabel layerStyle="text">Email: </FormLabel>
          <Input
            onChange={handleChangeForm}
            name="email"
            type="email"
            value={signUpForm.email}
            layerStyle="text"
          />
          {isEmailError && (
            <FormErrorMessage>A valid email is required.</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={isUsernameError}>
          <FormLabel layerStyle="text">Username: </FormLabel>
          <Input
            onChange={handleChangeForm}
            name="username"
            type="text"
            value={signUpForm.username}
            layerStyle="text"
          />
          {isUsernameError && (
            <FormErrorMessage>Username is required.</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={isPasswordError}>
          <FormLabel layerStyle="text">Password: </FormLabel>
          <InputGroup size="md">
            <Input
              onChange={handleChangeForm}
              name="password"
              type={show ? "text" : "password"}
              value={signUpForm.password}
              layerStyle="text"
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
        <FormControl isRequired isInvalid={isSecondPasswordError}>
          <FormLabel layerStyle="text">Enter Password Again: </FormLabel>
          <InputGroup size="md">
            <Input
              onChange={handleChangeForm}
              name="secondPassword"
              type={showSecond ? "text" : "password"}
              value={secondPassword}
              layerStyle="text"
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={handleShowHideSecondPasswordClick}
              >
                {showSecond ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          {isSecondPasswordError && (
            <FormErrorMessage>Passwords do not match.</FormErrorMessage>
          )}
        </FormControl>
        <Box display="flex" flexDirection="column" alignSelf="flex-start">
          <Text layerStyle="text">Profile Picture:</Text>
          <Button>Choose File</Button>
        </Box>
        <Button w="100%" onClick={onSubmit}>
          Submit
        </Button>
        <Box display="flex" alignItems="center" gap={4} marginTop={2}>
          <Text layerStyle="text">Already have an account? </Text>
          <Button
            onClick={() => {
              navigate("/log-in");
            }}
          >
            Log in
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export { SignUp };
