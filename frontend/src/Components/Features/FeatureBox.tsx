import { Box, Text, useDisclosure } from "@chakra-ui/react";
import { Feature, ProjectType } from "../../Pages";
import { FeatureModal } from "./FeatureModal";
import { Dispatch, SetStateAction } from "react";

type Props = {
  feature: Feature;
  projectId: number;
  setProject: Dispatch<SetStateAction<ProjectType>>;
};

const FeatureBox = ({ feature, projectId, setProject }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        key={feature.id}
        border="1px solid black"
        p={4}
        mx={4}
        mt={4}
        display="flex"
        justifyContent="space-between"
        onClick={onOpen}
        cursor="pointer"
      >
        <Text>{feature.name}</Text>
        <Text>
          {feature.completedUserStories}/{feature.userStoryCount}
        </Text>
      </Box>
      <FeatureModal
        isOpen={isOpen}
        onClose={onClose}
        featureName={feature.name}
        featureDescription={
          feature.description || "There is no feature description..."
        }
        featureId={feature.id}
        projectId={projectId}
        stories={feature?.userStories}
        setProject={setProject}
      />
    </>
  );
};

export { FeatureBox };
