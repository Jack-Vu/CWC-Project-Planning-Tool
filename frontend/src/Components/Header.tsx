import { Box, Heading, Image } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const pages = [
  { name: "Log In", path: "/log-in", showWhenLoggedIn: false },
  { name: "Create an Account", path: "/sign-up", showWhenLoggedIn: false },
  { name: "Projects", path: "/projects", showWhenLoggedIn: true },
  { name: "Account Details", path: "/profile", showWhenLoggedIn: true }
];
type Props = {
  loggedIn: boolean;
};

const Header = ({ loggedIn }: Props) => {
  return (
    <Box p={4} display="flex" alignItems="center">
      <Box p={4} display="flex" gap={4} alignItems="center">
        <Image
          borderRadius="50%"
          boxSize="70px"
          src="https://media.istockphoto.com/id/1195743934/vector/cute-panda-character-vector-design.jpg?s=612x612&w=0&k=20&c=J3ht-bKADmsXvF6gFIleRtfJ6NGhXnfIsrwlsUF8w80="
          alt="Profile Picture Logo"
        />
        <Heading fontSize="24px">Project Planning Tool</Heading>
      </Box>
      <Box display="flex" justifyContent="space-around" w="70%">
        {pages.map((page) => {
          if (
            (loggedIn && page.showWhenLoggedIn) ||
            (!loggedIn && !page.showWhenLoggedIn)
          ) {
            return (
              <Link to={page.path} key={page.name}>
                <Box>{page.name}</Box>
              </Link>
            );
          } else {
            return null;
          }
        })}
      </Box>
    </Box>
  );
};

export { Header };
