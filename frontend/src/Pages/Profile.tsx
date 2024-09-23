import { Avatar, Box, Button, Text, useToast } from "@chakra-ui/react";
import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import { Context, Data } from "../App";
import { UserDetailsRow } from "../Components";

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
      <Text fontSize={20} textAlign="center" mb={4}>
        Welcome {data.name}! You can manage your account details here.
      </Text>
      <Box
        display="flex"
        alignItems="center"
        margin="0 auto"
        py={20}
        w="60%"
        gap={10}
      >
        <Avatar size="2xl" name={data.name}></Avatar>
        <Box w="100%" display="flex" flexDirection="column" gap={3}>
          <UserDetailsRow field="Name" value={data.name} />
          <UserDetailsRow field="Email Address" value={data.email} />
          <UserDetailsRow field="Username" value={data.username} />
          <UserDetailsRow field="Password" value={"*********"} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" gap={4}>
        <Button onClick={onLogOut}>Log Out</Button>
        <Button onClick={onLogOut}>Delete Account</Button>
      </Box>
    </>
  );
};

export { Profile };
