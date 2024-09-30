import { Box, Text } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { Data } from "../App";
import { CreateProjectAccordion } from "../Components/Projects";
import { useState } from "react";

export type Project = {
  name: string;
  description?: string;
  status: string;
};

const fakeProjects: Project[] = [
  {
    name: "Project A",
    description:
      "This is the description of Project A Lorem ipsum dolor, sit amet consectetur adipisicing elit. At vitae nulla, doloremque repellat magnam dignissimos porro harum animi odit tempore labore iste officia fugit ab impedit itaque. Iusto, consequatur placeat",
    status: "To Do"
  },
  {
    name: "Project B",
    description:
      "This is the description of Project B Lorem ipsum dolor, sit amet consectetur adipisicing elit. At vitae nulla, doloremque repellat magnam dignissimos porro harum animi odit tempore labore iste officia fugit ab impedit itaque. Iusto, consequatur placeat",
    status: "To Do"
  },
  {
    name: "Project C",
    description:
      "This is the description of Project C Lorem ipsum dolor, sit amet consectetur adipisicing elit. At vitae nulla, doloremque repellat magnam dignissimos porro harum animi odit tempore labore iste officia fugit ab impedit itaque. Iusto, consequatur placeat",
    status: "In progress"
  },
  {
    name: "Project D",
    description:
      "This is the description of Project D Lorem ipsum dolor, sit amet consectetur adipisicing elit. At vitae nulla, doloremque repellat magnam dignissimos porro harum animi odit tempore labore iste officia fugit ab impedit itaque. Iusto, consequatur placeat",
    status: "Done!"
  },
  {
    name: "Project E",
    description:
      "This is the description of Project E Lorem ipsum dolor, sit amet consectetur adipisicing elit. At vitae nulla, doloremque repellat magnam dignissimos porro harum animi odit tempore labore iste officia fugit ab impedit itaque. Iusto, consequatur placeat",
    status: "Done!"
  }
];
const Projects = () => {
  const data = useLoaderData() as Data;
  const [projects, setProjects] = useState(fakeProjects);
  console.log("Data", data);

  return (
    <Box mb={4} fontSize={20}>
      <Text textAlign="center">{data.name}'s Projects</Text>
      <Box m={10}>
        {projects.map((project: Project) => {
          return (
            <Box
              key={project.name}
              display="flex"
              border="1px solid black"
              p={4}
              mb={6}
            >
              <Text w="10%">{project.name}</Text>
              <Text flex={1} isTruncated>
                {project.description}
              </Text>
              <Text w="15%" ml={10}>
                {project.status}
              </Text>
            </Box>
          );
        })}
        <CreateProjectAccordion projects={projects} setProjects={setProjects} />
      </Box>
    </Box>
  );
};

export { Projects };
