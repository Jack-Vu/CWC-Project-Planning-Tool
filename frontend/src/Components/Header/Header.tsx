import { Box, Heading, Image, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { FullMenu } from "./FullMenu";
import { HamburgerMenu } from "./HamburgerMenu";
import { Link } from "react-router-dom";

export type Page = {
  name: string;
  path: string;
  showWhenLoggedIn: boolean;
};

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
  const [isLargerThan1000] = useMediaQuery("(min-width: 1000px)");
  const [isLargerThan775] = useMediaQuery("(min-width: 775px)");
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");
  const [isLargerThan350] = useMediaQuery("(min-width: 350px)");

  const filterPages = (pages: Page[]) => {
    return pages.filter((page) => {
      if (loggedIn) {
        return page.showWhenLoggedIn;
      } else {
        return !page.showWhenLoggedIn;
      }
    });
  };

  return (
    <Box
      py={4}
      px={isLargerThan500 ? 8 : 4}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Link to={loggedIn ? "/projects" : "/"}>
        <Box
          display="flex"
          flex={1}
          gap={isLargerThan500 ? 4 : 2}
          alignItems="center"
        >
          <Image
            borderRadius="50%"
            boxShadow="lg"
            boxSize={
              isLargerThan775
                ? "80px"
                : isLargerThan500
                ? "65px"
                : isLargerThan350
                ? "58px"
                : "50px"
            }
            src="https://media.istockphoto.com/id/1195743934/vector/cute-panda-character-vector-design.jpg?s=612x612&w=0&k=20&c=J3ht-bKADmsXvF6gFIleRtfJ6NGhXnfIsrwlsUF8w80="
            alt="Profile Picture Logo"
          />
          <Heading
            layerStyle="heading"
            fontSize={isLargerThan775 ? "4xl" : isLargerThan500 ? "3xl" : "xl"}
          >
            {isLargerThan350 ? "Project Planning Tool" : "Planning Tool"}
          </Heading>
        </Box>
      </Link>

      {isLargerThan1000 ? (
        <FullMenu pages={filterPages(pages)} />
      ) : (
        <HamburgerMenu
          pages={filterPages(pages)}
          isLargerThan350={isLargerThan350}
        />
      )}
    </Box>
  );
};

export { Header };
