import { Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Page } from "./Header";

type Props = {
  pages: Page[];
};

const FullMenu = ({ pages }: Props) => {
  return (
    <Box
      display="flex"
        w="35%"
      alignItems="center"
      justifyContent="space-around"
    >
      {pages.map((page) => {
        return (
          <Link to={page.path} key={page.name}>
            <Box layerStyle="text" fontSize="18px">
              {page.name}
            </Box>
          </Link>
        );
      })}
    </Box>
  );
};

export { FullMenu };
