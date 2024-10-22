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
  Task,
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
};

export type UserStory = {
  name: string;
  description: string;
  status: string;
  id: number;
  tasks: Task[];
};

function FeatureModal({
  isOpen,
  onClose,
  featureName,
  featureDescription,
  featureId,
  projectId,
  featureUserStories
}: Props) {
  const [userStories, setUserStories] = useState(featureUserStories);
  useEffect(() => {
    setUserStories(featureUserStories);
  }, [featureUserStories]);

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent minW="75%" minH="75%">
        <Box m={10}>
          <Box mb={10}>
            <Text mb={4} fontSize={20}>
              {featureName}
            </Text>
            <Text>
              {featureDescription || "There is no feature description"}
            </Text>
          </Box>
          <ModalCloseButton />
          {userStories?.map((story) => {
            return (
              <Box key={story.id}>
                <UserStoryDetailsAccordion
                  name={story.name}
                  description={story.description}
                  status={story.status}
                  featureId={featureId}
                  projectId={projectId}
                  userStoryId={story.id}
                  userStoryTask={story.tasks}
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
