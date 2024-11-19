import { HamburgerIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useMediaQuery
} from "@chakra-ui/react";
import React from "react";
import { Page } from "./Header";
import { Link } from "react-router-dom";

type Props = {
  pages: Page[];
  isLargerThan350: boolean;
};

const HamburgerMenu = ({ pages, isLargerThan350 }: Props) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        colorScheme="green"
        size={isLargerThan350 ? "md" : "sm"}
      />
      <MenuList>
        {pages.map((page) => {
          return (
            <Link to={page.path} key={page.name}>
              <MenuItem layerStyle={"text"}>{page.name}</MenuItem>
            </Link>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export { HamburgerMenu };
