import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text
} from "@chakra-ui/react";
import axios from "axios";
import { ChangeEvent, useState } from "react";

const SignUp = () => {
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
    password: false
  });
  const [show, setShow] = useState(false);

  const isInvalidEmail = (email: string) => {
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.match(emailFormat)) {
      return true;
    } else {
      return false;
    }
  };
  const isNameError = signUpForm.name === "" && submitClicked.name;
  const isEmailError = signUpForm.email === "" && submitClicked.email;
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
      name: true,
      email: true,
      username: true,
      password: true
    });
    if (
      signUpForm.name === "" ||
      signUpForm.email === "" ||
      signUpForm.username === "" ||
      signUpForm.password === ""
    ) {
      return;
    } else {
      axios
        .post("http://localhost:3025/auth/sign-up", {
          name: signUpForm.name,
          email: signUpForm.name,
          username: signUpForm.username,
          password: signUpForm.password
        })
        .then((response) => {
          console.log("Response:", response);
          setSignUpForm({
            name: "",
            email: "",
            username: "",
            password: ""
          });
          setSubmitClicked({
            name: false,
            email: false,
            username: false,
            password: false
          });
        });
    }
  };
  const handleShowHideClick = () => setShow(!show);

  return (
    <Box>
      <Text textAlign="center" mb={4} fontSize="20px">
        Create An Account
      </Text>
      <Box
        maxW="75%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        margin="0 auto"
        gap={4}
      >
        <FormControl isRequired isInvalid={isNameError}>
          <FormLabel>Name: </FormLabel>
          <Input
            onChange={handleChangeForm}
            name="name"
            type="text"
            value={signUpForm.name}
          />
          {isNameError && (
            <FormErrorMessage>Name is required!</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={isEmailError}>
          <FormLabel>Email: </FormLabel>
          <Input
            onChange={handleChangeForm}
            name="email"
            type="email"
            value={signUpForm.email}
          />
          {isEmailError && (
            <FormErrorMessage>A valid email is required!</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={isUsernameError}>
          <FormLabel>Username: </FormLabel>
          <Input
            onChange={handleChangeForm}
            name="username"
            type="text"
            value={signUpForm.username}
          />
          {isUsernameError && (
            <FormErrorMessage>Username is required!</FormErrorMessage>
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
            <FormErrorMessage>Password is required!</FormErrorMessage>
          )}
        </FormControl>
        <Box display="flex" flexDirection="column" alignSelf="flex-start">
          <Text>Profile Picture:</Text>
          <Button>Choose File</Button>
        </Box>
        <Button w="100%" onClick={onSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export { SignUp };
