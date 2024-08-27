import axios from "axios";
import { Box, Button, ChakraProvider, Input } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";

function App() {
  const [firstName, setFirstName] = useState("Jack");
  const [lastName, setLastName] = useState("Vu");

  const handleChangeFirstName = (e: ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };
  const handleChangeLastName = (e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleClick = async () => {
    const response = await axios.post("http://localhost:3025/name", {
      firstName,
      lastName
    });
    console.log("Response", response.data);
    console.log(firstName, lastName);
  };
  return (
    <ChakraProvider>
      <Box display="flex" m={10} gap={4}>
        <Input
          placeholder="Type in a first name..."
          name="first"
          onChange={handleChangeFirstName}
        />
        <Input
          placeholder="Type in a last name..."
          name="last"
          onChange={handleChangeLastName}
        />
        <Button colorScheme="purple" onClick={handleClick}>
          Add
        </Button>
      </Box>
    </ChakraProvider>
  );
}

export default App;
