import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";
import { useLoaderData } from "react-router-dom";
import { ProjectType } from "./Projects";

const columns = [{ name: "To Do" }, { name: "In Progress" }, { name: "Done" }];

const features = [
  {
    name: "Feature A",
    status: "To Do",
    userStoryCount: 10,
    completedUserStories: 0
  },
  {
    name: "Feature B",
    status: "Done",
    userStoryCount: 10,
    completedUserStories: 10
  },
  {
    name: "Feature B1",
    status: "Done",
    userStoryCount: 10,
    completedUserStories: 10
  },
  {
    name: "Feature B2",
    status: "Done",
    userStoryCount: 10,
    completedUserStories: 10
  },
  {
    name: "Feature C",
    status: "In Progress",
    userStoryCount: 10,
    completedUserStories: 2
  },
  {
    name: "Feature C1",
    status: "In Progress",
    userStoryCount: 10,
    completedUserStories: 3
  },
  {
    name: "Feature C2",
    status: "In Progress",
    userStoryCount: 10,
    completedUserStories: 4
  },
  {
    name: "Feature D",
    status: "To Do",
    userStoryCount: 10,
    completedUserStories: 0
  },
  {
    name: "Feature E",
    status: "To Do",
    userStoryCount: 10,
    completedUserStories: 0
  }
];

const Project = () => {
  const data = useLoaderData() as ProjectType;
  console.log(data);

  return (
    <Box m={10}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={20}
      >
        <Box>
          <Text mb={4} fontSize={20}>
            {data.name}
          </Text>
          <Text>{data.description || "There is no product description"}</Text>
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
                      m={4}
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Text >{feature.name}</Text>
                      <Text>
                        {feature.completedUserStories}/{feature.userStoryCount}
                      </Text>
                    </Box>
                  );
                }
                return null;
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export { Project };
