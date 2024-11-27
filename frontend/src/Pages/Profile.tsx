import {
  Avatar,
  Box,
  Button,
  Heading,
  Text,
  useMediaQuery,
  useToast
} from "@chakra-ui/react";
import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import { Context, Data } from "../App";
import { UserDetailsRow } from "../Components";
import { useState } from "react";
import axios from "axios";

const Profile = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [isLargerThan400] = useMediaQuery("(min-width: 400px)");
  const [isLargerThan825] = useMediaQuery("(min-width: 825px)");
  const [isLargerThan1200] = useMediaQuery("(min-width: 1200px)");

  const loaderData = useLoaderData() as Data;
  const [data, setData] = useState(loaderData);
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

  const deleteAccount = () => {
    const token = localStorage.getItem("token");
    context.toggledLoggedIn();
    axios
      .post(
        "http://localhost:3025/auth/delete-user",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        localStorage.removeItem("token");
        navigate("/sign-up");
        toast({
          title: "Success.",
          description: "Your account has been deleted!",
          status: "success",
          duration: 3000,
          isClosable: true
        });
      })
      .catch((error) => {
        toast({
          title: "Error.",
          description:
            "There was an error deleting your account. Please try again!",
          status: "error",
          duration: 3000,
          isClosable: true
        });
      });
  };

  const fieldMap = [
    { field: "name", title: "Name", value: data.name },
    { field: "email", title: "Email", value: data.email },
    { field: "username", title: "Username", value: data.username },
    { field: "password", title: "Password", value: "*********" }
  ];

  return (
    <Box mt={20}>
      <Heading layerStyle="heading" textAlign="center" mb={4} fontSize="28px">
        Account Details
      </Heading>
      <Text mx={4} layerStyle="text" fontSize={20} textAlign="center" mb={4}>
        Welcome {data.name}! You can manage your account details here.
      </Text>
      <Box
        display="flex"
        alignItems="center"
        margin="0 auto"
        py={20}
        w={isLargerThan825 ? "60%" : "90%"}
        gap={10}
        flexDirection={isLargerThan1200 ? "row" : "column"}
      >
        <Avatar size="2xl" name={data.name}></Avatar>
        <Box w="100%" display="flex" flexDirection="column" gap={3}>
          {fieldMap.map(({ field, title, value }) => {
            return (
              <UserDetailsRow
                key={title}
                field={field}
                title={title}
                value={value}
                username={data.username}
                setData={setData}
              />
            );
          })}
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        gap={4}
        flexDir={isLargerThan400 ? "row" : "column"}
        mx={2}
        mb={20}
      >
        <Button colorScheme="green" onClick={onLogOut}>
          Log Out
        </Button>
        <Button colorScheme="green" onClick={deleteAccount}>
          Delete Account
        </Button>
      </Box>
    </Box>
  );
};

export { Profile };
