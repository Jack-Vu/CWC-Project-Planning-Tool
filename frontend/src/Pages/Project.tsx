import {
  Box,
  Button,
  Heading,
  IconButton,
  Input,
  Text,
  Textarea,
  useDisclosure,
  useMediaQuery,
  useToast
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

import { DeleteModal, StatusColumn, UserStory } from "../Components";
import { ProjectType } from "./Projects";
import axios from "axios";
import { CheckIcon, EditIcon } from "@chakra-ui/icons";

export type Feature = {
  name: string;
  description?: string;
  status: "To Do" | "In Progress" | "Done!";
  userStories: UserStory[];
  userStoryCount: number;
  completedUserStories: number;
  id: number;
};

const columns = [{ name: "To Do" }, { name: "In Progress" }, { name: "Done!" }];
const Project = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const loaderData = useLoaderData() as ProjectType;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");

  const [project, setProject] = useState(loaderData);

  const [projectName, setProjectName] = useState(project.name);
  const [projectDescription, setProjectDescription] = useState(
    project.description
  );

  const [updateProjectName, setUpdateProjectName] = useState(false);
  const [updateProjectDescription, setUpdateProjectDescription] =
    useState(false);

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const onChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setProjectDescription(e.target.value);
  };

  const editName = () => {
    setUpdateProjectName(!updateProjectName);
  };

  const editDescription = () => {
    setUpdateProjectDescription(!updateProjectDescription);
  };

  const updateProject = (field: "name" | "description", value?: string) => {
    const token = localStorage.getItem("token");
    if (projectName === "") {
      toast({
        title: "Error.",
        description: "Please enter a valid feature name!",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      setProjectName(project.name);
      return;
    } else {
      axios
        .post(
          "http://localhost:3025/auth/update-project",
          {
            field,
            value,
            projectId: project.id
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        .then((response) => {
          setProject(response.data);
          if (field === "name") {
            setUpdateProjectName(false);
          } else {
            setUpdateProjectDescription(false);
          }
          toast({
            title: "Success.",
            description: `Your project ${field} has been updated!`,
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
                "There was an error updating your project. Please try again!",
              status: "error",
              duration: 3000,
              isClosable: true
            });
          }
        });
    }
  };

  const deleteProject = () => {
    const token = localStorage.getItem("token");

    axios
      .post(
        "http://localhost:3025/auth/delete-project",
        {
          projectId: project.id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then((response) => {
        toast({
          title: "Success.",
          description: "Your project has been deleted!",
          status: "success",
          duration: 3000,
          isClosable: true
        });
        navigate("/projects");
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
              "There was an error deleting your project. Please try again!",
            status: "error",
            duration: 3000,
            isClosable: true
          });
        }
      });
  };

  return (
    <Box key={project.name}>
      <Box mx={isLargerThan500 ? 10 : 4} mt={20}>
        <Box display="flex" mb={20}>
          <Box display="flex" flex={1} flexDir="column" gap={4}>
            <Box display="flex" gap={5}>
              {updateProjectName ? (
                <Input
                  value={projectName}
                  onChange={onChangeName}
                  h="32px"
                  autoFocus
                  variant="filled"
                  type={"text"}
                />
              ) : (
                <Heading layerStyle="heading" fontSize={28} lineHeight="32px">
                  {project.name}
                </Heading>
              )}
              <IconButton
                colorScheme="green"
                size="sm"
                aria-label={`Edit User Story`}
                icon={updateProjectName ? <CheckIcon /> : <EditIcon />}
                onClick={
                  updateProjectName
                    ? () => {
                        updateProject("name", projectName);
                      }
                    : editName
                }
              />
            </Box>
            <Box display="flex" gap={5}>
              {updateProjectDescription ? (
                <Textarea
                  variant="filled"
                  value={projectDescription}
                  onChange={onChangeDescription}
                  autoFocus
                  layerStyle="text"
                />
              ) : (
                <Text layerStyle="text" mr={4} lineHeight="32px">
                  {project.description || "There is no project description..."}
                </Text>
              )}
              <IconButton
                colorScheme="green"
                size="sm"
                aria-label={`Edit User Story`}
                icon={updateProjectDescription ? <CheckIcon /> : <EditIcon />}
                onClick={
                  updateProjectDescription
                    ? () => {
                        updateProject("description", projectDescription);
                      }
                    : editDescription
                }
              />
            </Box>
          </Box>
        </Box>
        <Box display="flex" gap={10} flexWrap="wrap">
          {columns.map((column) => {
            return (
              <StatusColumn
                key={column.name}
                column={column}
                project={project}
                setProject={setProject}
              />
            );
          })}
          <Button colorScheme="green" onClick={onOpen} w={"100%"} mb={10}>
            Delete Project
          </Button>
        </Box>
      </Box>
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        deleteItem={deleteProject}
        itemType="project"
      />
    </Box>
  );
};

export { Project };
