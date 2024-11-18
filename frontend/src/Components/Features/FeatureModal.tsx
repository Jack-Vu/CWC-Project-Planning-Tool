import {
  Box,
  Button,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import {
  CreateUserStoryAccordion,
  Task,
  UserStoryDetailsAccordion
} from "../UserStories";
import { ProjectType } from "../../Pages";
import { ChangeEvent, useState } from "react";
import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DeleteModal } from "../DeleteModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  featureDescription?: string;
  featureId: number;
  projectId: number;
  stories: UserStory[];
  setProject: React.Dispatch<React.SetStateAction<ProjectType>>;
};

export type UserStory = {
  name: string;
  description: string;
  id: number;
  tasks: Task[];
  completedTasks: number;
  tasksCount: number;
};

function FeatureModal({
  isOpen,
  onClose,
  featureName,
  featureDescription,
  featureId,
  projectId,
  stories,
  setProject
}: Props) {
  const toast = useToast();
  const navigate = useNavigate();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete
  } = useDisclosure();

  const [name, setName] = useState(featureName);
  const [description, setDescription] = useState(featureDescription);

  const [updateFeatureName, setUpdateFeatureName] = useState(false);
  const [updateFeatureDescription, setUpdateFeatureDescription] =
    useState(false);

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const editName = () => {
    setUpdateFeatureName(!updateFeatureName);
  };
  const editDescription = () => {
    setUpdateFeatureDescription(!updateFeatureDescription);
  };

  const updateFeature = (field: "name" | "description", value?: string) => {
    const token = localStorage.getItem("token");
    if (name === "") {
      toast({
        title: "Error.",
        description: "Please enter a valid feature name!",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      setName(featureName);
      return;
    } else {
      axios
        .post(
          "http://localhost:3025/auth/update-feature",
          {
            field,
            value,
            featureId
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        .then((response) => {
          setProject(response.data);
          if (field === "name") {
            setUpdateFeatureName(false);
          } else {
            setUpdateFeatureDescription(false);
          }
          toast({
            title: "Success.",
            description: `Your feature ${field} has been updated!`,
            status: "success",
            duration: 3000,
            isClosable: true
          });
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
                "There was an error updating your feature. Please try again!",
              status: "error",
              duration: 3000,
              isClosable: true
            });
          }
        });
    }
  };

  const deleteFeature = () => {
    const token = localStorage.getItem("token");

    axios
      .post(
        "http://localhost:3025/auth/delete-feature",
        {
          featureId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then((response) => {
        setProject(response.data);
        toast({
          title: "Success.",
          description: "Your feature has been deleted!",
          status: "success",
          duration: 3000,
          isClosable: true
        });
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
              "There was an error deleting your feature. Please try again!",
            status: "error",
            duration: 3000,
            isClosable: true
          });
        }
      });
  };
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent minW="75%" minH="75%" justifyContent="space-between">
        <Box m={10}>
          <Box mb={20}>
            <Box display="flex" alignItems="center" mb={4} gap={4}>
              {updateFeatureName ? (
                <Input
                  value={name}
                  onChange={onChangeName}
                  h="40px"
                  autoFocus
                  type={"text"}
                />
              ) : (
                <Heading layerStyle="heading" fontSize={28}>{featureName}</Heading>
              )}
              <IconButton
                aria-label={`Edit User Story`}
                icon={updateFeatureName ? <CheckIcon /> : <EditIcon />}
                onClick={
                  updateFeatureName
                    ? () => {
                        updateFeature("name", name);
                      }
                    : editName
                }
              />
            </Box>
            <Box display="flex" alignItems="center" gap={4}>
              {updateFeatureDescription ? (
                <Input
                  value={description}
                  onChange={onChangeDescription}
                  h="40px"
                  autoFocus
                  type={"text"}
                  layerStyle="text"
                />
              ) : (
                <Text layerStyle="text">{featureDescription}</Text>
              )}
              <IconButton
                aria-label={`Edit User Story`}
                icon={updateFeatureDescription ? <CheckIcon /> : <EditIcon />}
                onClick={
                  updateFeatureDescription
                    ? () => {
                        updateFeature("description", description);
                      }
                    : editDescription
                }
              />
            </Box>
          </Box>
          <ModalCloseButton />
          {stories?.map((story) => {
            return (
              <Box key={story.id}>
                <UserStoryDetailsAccordion
                  name={story.name}
                  description={story.description}
                  status={`${story.completedTasks}/${story.tasksCount}`}
                  featureId={featureId}
                  projectId={projectId}
                  userStoryId={story.id}
                  tasks={story.tasks}
                  setProject={setProject}
                />
              </Box>
            );
          })}
          <Box mt={4}>
            <CreateUserStoryAccordion
              featureId={featureId}
              projectId={projectId}
              setProject={setProject}
            />
          </Box>
        </Box>
        <Button m={10} onClick={onOpenDelete}>
          Delete Feature
        </Button>
      </ModalContent>
      <DeleteModal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        itemType="feature"
        deleteItem={deleteFeature}
      />
    </Modal>
  );
}

export { FeatureModal };
