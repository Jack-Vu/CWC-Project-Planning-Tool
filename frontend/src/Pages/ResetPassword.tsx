import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { id, token } = useParams();

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
    // setPassword("");
    // setSecondPassword("");
  
  };

  return (
    <Box
      maxW="75%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      margin="0 auto"
      gap={4}
    >
      <FormControl isRequired isInvalid={isPasswordError}>
        <FormLabel>Password: </FormLabel>
        <InputGroup size="md">
          <Input
            onChange={handleChangePassword}
            name="password"
            type={show ? "text" : "password"}
            value={password}
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
        <FormLabel>Re-enter Password: </FormLabel>
        <InputGroup size="md">
          <Input
            onChange={handleChangeSecondPassword}
            name="password"
            type={showSecond ? "text" : "password"}
            value={secondPassword}
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
      <Button w="100%" onClick={onSubmit}>
        Submit
      </Button>
    </Box>
  );
};

export { ResetPassword };
