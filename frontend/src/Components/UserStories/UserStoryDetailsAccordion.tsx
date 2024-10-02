import { DeleteIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text
} from "@chakra-ui/react";
import React from "react";

type Props = {
  name: string;
  status: string;
  description: string;
};

function UserStoryDetailsAccordion({ name, status, description }: Props) {
  return (
    <Accordion allowToggle>
      <AccordionItem borderTop="none">
        <Box
          border="1px solid black"
          w="100%"
          h="58px"
          mt={4}
          display="flex"
          justifyContent="space-between"
        >
          <AccordionButton p={4}>
            <Box flex={1} textAlign="left">
              <Text>{name}</Text>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Text>{status}</Text>
              <DeleteIcon />
              <AccordionIcon />
            </Box>
          </AccordionButton>
        </Box>
        <AccordionPanel border="1px solid black" borderTop="none">
          {description}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export { UserStoryDetailsAccordion };
