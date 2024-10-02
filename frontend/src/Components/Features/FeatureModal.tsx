import { ArrowDownIcon, ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text
} from "@chakra-ui/react";
import { UserStoryDetailsAccordion } from "../UserStories";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  featureDescription: string;
};

const sampleUserStories = [
  {
    name: "User Story 1",
    description: "This is my user story description!",
    status: "2/10"
  },
  {
    name: "User Story 2",
    description: "This is my user story description!",
    status: "4/10"
  },
  {
    name: "User Story 3",
    description: "This is my user story description!",
    status: "1/10"
  },
  {
    name: "User Story 4",
    description: "This is my user story description!",
    status: "0/10"
  },
  {
    name: "User Story 5",
    description: "This is my user story description!",
    status: "7/10"
  }
];

function FeatureModal({
  isOpen,
  onClose,
  featureName,
  featureDescription
}: Props) {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent minW="75%" minH="75%">
        <Box m={10}>
          <Box mb={10}>
            <Text mb={4} fontSize={20}>
              {featureName}
            </Text>
            <Text>{featureDescription}</Text>
          </Box>
          <ModalCloseButton />
          {sampleUserStories.map((story) => {
            return (
              <UserStoryDetailsAccordion
                name={story.name}
                description={story.description}
                status={story.status}
              />
            );
          })}
        </Box>
      </ModalContent>
    </Modal>
  );
}

export { FeatureModal };
