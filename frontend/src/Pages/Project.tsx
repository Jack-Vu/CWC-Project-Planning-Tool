import { Box, Button, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";

import { CreateFeatureAccordion, FeatureBox, UserStory } from "../Components";
import { ProjectType } from "./Projects";

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
  const loaderData = useLoaderData() as ProjectType;
  const [project, setProject] = useState(loaderData);
  console.log(project);

  return (
    <>
      <Box m={10}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={20}
        >
          <Box>
            <Text mb={4} fontSize={20}>
              {project.name}
            </Text>
            <Text>
              {project.description || "There is no project description..."}
            </Text>
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
