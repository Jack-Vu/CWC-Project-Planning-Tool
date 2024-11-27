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
  useDisclosure,
  useMediaQuery,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Context } from "../App";
import { ForgotPasswordModal } from "../Components";

const LogIn = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const context = useOutletContext() as Context;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan350] = useMediaQuery("(min-width: 350px)");
  const [isLargerThan420] = useMediaQuery("(min-width: 420px)");
  const [isLargerThan600] = useMediaQuery("(min-width: 600px)");

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
            title: "Success.",
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
    <Box my={20}>
      <Heading
        layerStyle="heading"
        textAlign="center"
        mb={4}
        fontSize={isLargerThan350 ? "28px" : "24px"}
      >
        Log In Your Account
      </Heading>
      <Box
        maxW={isLargerThan600 ? "75%" : "90%"}
        display="flex"
        flexDirection="column"
        alignItems="center"
        margin="0 auto"
        gap={4}
      >
        <FormControl isRequired isInvalid={isUsernameError}>
          <FormLabel layerStyle="text">Username: </FormLabel>
          <Input
            variant="filled"
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
              variant="filled"
              onChange={handleChangeForm}
              name="password"
              type={show ? "text" : "password"}
              value={signUpForm.password}
              layerStyle="text"
            />
            <InputRightElement width="4.5rem">
              <Button
                colorScheme="green"
                h="1.75rem"
                size="sm"
                onClick={handleShowHideClick}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          {isPasswordError && (
            <FormErrorMessage>A password is required</FormErrorMessage>
          )}
        </FormControl>
        <Button colorScheme="green" w="100%" onClick={onSubmit}>
          Submit
        </Button>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={isLargerThan420 ? 10 : 4}
          mt={10}
          flexWrap="wrap"
        >
          <Text layerStyle="text" lineHeight="40px">
            Forgot your password?{" "}
          </Text>
          <Button colorScheme="green" onClick={onOpen}>
            Reset Password
          </Button>
        </Box>
      </Box>
      <ForgotPasswordModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export { LogIn };
