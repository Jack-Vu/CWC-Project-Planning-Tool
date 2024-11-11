import {
  Box,
  Button,
  IconButton,
  Input,
  Text,
  useToast
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

import { CreateFeatureAccordion, FeatureBox, UserStory } from "../Components";
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
  const onChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
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

  return (
    <>
      <Box m={10}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={20}
        >
          <Box display="flex" flexDir="column" gap={4}>
            <Box display="flex" gap={5} alignItems="center">
              {updateProjectName ? (
                <Input
                  value={projectName}
                  onChange={onChangeName}
                  h="40px"
                  autoFocus
                  type={"text"}
                />
              ) : (
                <Text fontSize={20}>{project.name}</Text>
              )}
              <IconButton
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
            <Box display="flex" gap={5} alignItems="center">
              {updateProjectDescription ? (
                <Input
                  value={projectDescription}
                  onChange={onChangeDescription}
                  h="40px"
                  autoFocus
                  type={"text"}
                />
              ) : (
                <Text>{project.description}</Text>
              )}
              <IconButton
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
          <Button>Delete Project</Button>
        </Box>
        <Box display="flex" gap={10}>
          {columns.map((column) => {
            return (
              <Box key={column.name} border="1px solid black" flex={1}>
                <Text textAlign="center" fontSize={20} mt={2}>
                  {column.name}
                </Text>
                {project.features.map((feature) => {
                  if (feature.status === column.name) {
                    return (
                      <Box key={feature.id}>
                        <FeatureBox
                          feature={feature}
                          projectId={project.id}
                          setProject={setProject}
                        />
                      </Box>
                    );
                  }
                  return null;
                })}

                {column.name === "To Do" ? (
                  <Box m={4}>
                    <CreateFeatureAccordion
                      setProject={setProject}
                      projectId={project.id}
                    />
                  </Box>
                ) : null}
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

export { Project };
