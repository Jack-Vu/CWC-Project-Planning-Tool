import { Box, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { Feature, ProjectType } from "../../Pages";
import { FeatureModal } from "./FeatureModal";
import { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Props = {
  feature: Feature;
  projectId: number;
  setProject: Dispatch<SetStateAction<ProjectType>>;
};

const FeatureBox = ({ feature, projectId, setProject }: Props) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onCloseModal = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3025/auth/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setProject(response.data);
        onClose();
      })
      .catch((error) => {
        if (error.response.data.message === "Unauthorized") {
          toast({
            title: "Error.",
            description: "Your session has expired, please log in again!",
            status: "error",
            duration: 3000,
            isClosable: true
          });
          navigate("/log-in");
        } else {
          toast({
            title: "Error.",
            description:
              "There was an error updating your project. Please reload the page!",
            status: "error",
            duration: 3000,
            isClosable: true
          });
        }
      });
  };

  return (
    <>
      <Box
        key={feature.id}
        border="1px solid black"
        p={4}
        mx={4}
        my={4}
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
        onClose={onCloseModal}
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
