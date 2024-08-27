import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text
} from "@chakra-ui/react";
import React from "react";

const SignUp = () => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  //   const handleClick = async () => {
  //     const response = await axios.post("http://localhost:3025/name", {
  //       firstName,
  //       lastName
  //     });
  //     console.log("Response", response.data);
  //     console.log(firstName, lastName);
  //   };
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
        <Box w="100%">
          <Text>Name: </Text>
          <Input placeholder="Type in a last name..." type="text" />
        </Box>
        <Box w="100%">
          <Text>Email address: </Text>
          <Input placeholder="Type in a last name..." type="email" />
        </Box>
        <Box w="100%">
          <Text>Username: </Text>
          <Input placeholder="Type in a last name..." type="text" />
        </Box>
        <Box w="100%">
          <Text>Password: </Text>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter password"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
        <Box display="flex" flexDirection="column" alignSelf="flex-start">
          <Text>Profile Picture:</Text>
          <Button>Choose File</Button>
        </Box>
        <Button w="100%">Submit</Button>
      </Box>
    </Box>
  );
};

export { SignUp };
