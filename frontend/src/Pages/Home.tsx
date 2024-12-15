import { Box, Button, Heading, Text, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [isLargerThan400] = useMediaQuery("(min-width: 400px)");
  const [isLargerThan825] = useMediaQuery("(min-width: 825px)");

  return (
    <Box mt={20}>
      <Heading layerStyle="heading" textAlign="center" mb={4} fontSize="28px">
        Your only tool for all your project planning needs!
      </Heading>
      <Text
        w={isLargerThan825 ? "60%" : "90%"}
        pb={20}
        layerStyle="text"
        fontSize={20}
        textAlign="center"
        mb={4}
        m="0 auto"
      >
        You can add projects, features, user stories, and developer tasks. Stay
        tuned as we add more features to the Project Planning Tool!
      </Text>
      <Box
        display="flex"
        justifyContent="center"
        gap={4}
        flexDir={isLargerThan400 ? "row" : "column"}
        mx={2}
        mb={10}
      >
        <Link to="/log-in">
          <Button colorScheme="green">Log in</Button>
        </Link>
        <Link to="/sign-up">
          <Button colorScheme="green">Create an Account</Button>
        </Link>
      </Box>
    </Box>
  );
};

export { Home };
