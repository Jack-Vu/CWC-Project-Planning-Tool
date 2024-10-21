import {
  Box,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text
} from "@chakra-ui/react";
import {
  CreateUserStoryAccordion,
  UserStoryDetailsAccordion
} from "../UserStories";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  featureDescription: string;
  featureId: number;
  projectId: number;
  featureUserStories: UserStory[];
  setUserStories: Dispatch<SetStateAction<UserStory[]>>;
};

export type UserStory = {
  name: string;
  description: string;
  status: string;
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
  featureDescription,
  featureId,
  projectId,
  featureUserStories,
  setUserStories
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
          {featureUserStories?.map((story) => {
            return (
              <Box key={story.name}>
                <UserStoryDetailsAccordion
                  name={story.name}
                  description={story.description}
                  status={story.status}
                />
              </Box>
            );
          })}
          <Box mt={4}>
            <CreateUserStoryAccordion
              featureId={featureId}
              projectId={projectId}
              setUserStories={setUserStories}
            />
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
}

export { FeatureModal };
