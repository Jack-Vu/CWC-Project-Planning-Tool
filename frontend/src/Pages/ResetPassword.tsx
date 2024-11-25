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
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [show, setShow] = useState(false);
  const [showSecond, setSecondShow] = useState(false);
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");

  const [submitClicked, setSubmitClicked] = useState(false);
  const [submitSecondClicked, setSubmitSecondClicked] = useState(false);

  const isPasswordError = password === "" && submitClicked;
  const isSecondPasswordError =
    password !== secondPassword && submitSecondClicked;

  const handleShowHideClick = () => setShow(!show);
  const handleShowHideSecondPasswordClick = () => setSecondShow(!showSecond);

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setSubmitClicked(false);
    setSubmitSecondClicked(false);
    setPassword(e.target.value);
  };

  const handleChangeSecondPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setSubmitSecondClicked(false);
    setSubmitClicked(false);
    setSecondPassword(e.target.value);
  };

  const onSubmit = () => {
    setSubmitClicked(true);
    setSubmitSecondClicked(true);
    if (password !== "" && password === secondPassword) {
      axios
        .post("http://localhost:3025/auth/save-new-password", {
          newPassword: password,
          id,
          token
        })
        .then((response) => {
          setSubmitClicked(false);
          setSubmitSecondClicked(false);
          setPassword("");
          setSecondPassword("");
          navigate("/log-in");
          toast({
            title: "Success",
            description:
              "Your password has been reset! Please log in with your new password.",
            status: "success",
            duration: 3000,
            isClosable: true
          });
        })
        .catch(() => {
          setSubmitClicked(false);
          setSubmitSecondClicked(false);
          setPassword("");
          setSecondPassword("");
          toast({
            title: "Error",
            description:
              "We can not reset your password at this time. Please start the reset password process again!",
            status: "error",
            duration: 3000,
            isClosable: true
          });
        });
    }
  };

  return (
    <Box mt={20}>
      <Heading textAlign="center" mb={4} fontSize={28} layerStyle="heading">
        Reset your password
      </Heading>
      <Box
        maxW="75%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        margin="0 auto"
        gap={4}
      >
        <FormControl isRequired isInvalid={isPasswordError}>
          <FormLabel layerStyle="text">Password: </FormLabel>
          <InputGroup size="md">
            <Input
              variant="filled"
              onChange={handleChangePassword}
              name="password"
              type={show ? "text" : "password"}
              value={password}
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
          <FormLabel layerStyle="text">Re-enter Password: </FormLabel>
          <InputGroup size="md">
            <Input
              variant="filled"
              onChange={handleChangeSecondPassword}
              name="password"
              type={showSecond ? "text" : "password"}
              value={secondPassword}
              layerStyle="text"
            />
            <InputRightElement width="4.5rem">
              <Button
                colorScheme="green"
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
        <Button colorScheme="green" w="100%" onClick={onSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export { ResetPassword };
