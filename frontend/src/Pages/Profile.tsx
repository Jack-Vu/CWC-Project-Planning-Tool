import { Box, Button, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import { Context, Data } from "../App";

const Profile = () => {
  const data = useLoaderData() as Data;
  const navigate = useNavigate();
  const toast = useToast();
  const context = useOutletContext() as Context;

  const onLogOut = () => {
    localStorage.removeItem("token");
    context.toggledLoggedIn();
    navigate("/log-in");
    toast({
      title: "Success.",
      description: "You've been logged out of your account",
      status: "success",
      duration: 3000,
      isClosable: true
    });
  };

  return (
    <>
      <Text textAlign="center" mb={4} fontSize="20px">
        Account Details
      </Text>
      <Box
        maxW="75%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        margin="0 auto"
        gap={4}
      >
        <Text fontSize={20}>Hello, {`${data.username}`}</Text>
        <Text fontSize={20}>Page In Progress</Text>
        <Button onClick={onLogOut}>Log Out</Button>
      </Box>
    </>
  );
};

export { Profile };
