import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

import { CreateFeatureAccordion, FeatureModal, UserStory } from "../Components";
import { ProjectType } from "./Projects";

export type Feature = {
  name: string;
  description?: string;
  status: "To Do" | "In Progress" | "Done";
  userStories: UserStory[];
  userStoryCount: number;
  completedUserStories: number;
  id: number;
};

const columns = [{ name: "To Do" }, { name: "In Progress" }, { name: "Done" }];

const Project = () => {
  const project = useLoaderData() as ProjectType;
  const [features, setFeatures] = useState(project.features);
  const [selectedFeature, setSelectedFeature] = useState(features[0]);
  const [userStories, setUserStories] = useState(selectedFeature?.userStories);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
              {project.description || "There is no project description"}
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
                {features.map((feature) => {
                  if (feature.status === column.name) {
                    return (
                      <Box
                        key={feature.name}
                        border="1px solid black"
                        p={4}
                        mx={4}
                        mt={4}
                        display="flex"
                        justifyContent="space-between"
                        onClick={() => {
                          setUserStories(feature.userStories);
                          setSelectedFeature(feature);
                          onOpen();
                        }}
                        cursor="pointer"
                      >
                        <Text>{feature.name}</Text>
                        <Text>
                          {feature.completedUserStories}/
                          {feature.userStoryCount}
                        </Text>
                      </Box>
                    );
                  }
                  return null;
                })}

                {column.name === "To Do" ? (
                  <Box p={4}>
                    <CreateFeatureAccordion
                      setFeatures={setFeatures}
                      projectId={project.id}
                    />
                  </Box>
                ) : null}
              </Box>
            );
          })}
        </Box>
      </Box>
      {selectedFeature && (
        <FeatureModal
          isOpen={isOpen}
          onClose={onClose}
          featureName={selectedFeature.name}
          featureDescription={
            selectedFeature.description || "There is no feature description"
          }
          featureId={selectedFeature.id}
          projectId={project.id}
          featureUserStories={userStories}
          setUserStories={setUserStories}
        />
      )}
    </>
  );
};

export { Project };
