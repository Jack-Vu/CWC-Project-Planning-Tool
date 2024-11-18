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
    <Box py={4} px={8} display="flex" alignItems="center">
      <Box display="flex" gap={4} alignItems="center" flex={1}>
        <Image
          borderRadius="50%"
          boxShadow="lg"
          boxSize="80px"
          src="https://media.istockphoto.com/id/1195743934/vector/cute-panda-character-vector-design.jpg?s=612x612&w=0&k=20&c=J3ht-bKADmsXvF6gFIleRtfJ6NGhXnfIsrwlsUF8w80="
          alt="Profile Picture Logo"
        />
        <Heading layerStyle="heading">Project Planning Tool</Heading>
      </Box>
      <Box display="flex" justifyContent="space-around" w="50%">
        {pages.map((page) => {
          if (
            (loggedIn && page.showWhenLoggedIn) ||
            (!loggedIn && !page.showWhenLoggedIn)
          ) {
            return (
              <Link to={page.path} key={page.name}>
                <Box layerStyle="text">{page.name}</Box>
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
