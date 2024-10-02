import { Box, Text } from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Data } from "../App";
import { CreateProjectAccordion } from "../Components/Projects";
import { useState } from "react";
import { Feature } from "./Project";

export type ProjectType = {
  name: string;
  description?: string;
  status: string;
  id: number;
  features: Feature[];
};

type LoaderData = {
  user: Data;
  projects: ProjectType[];
};

const Projects = () => {
  const navigate = useNavigate();
  const data = useLoaderData() as LoaderData;
  const user = data.user as Data;
  const [projects, setProjects] = useState(data.projects);

  const onProjectClick = (id: number) => {
    navigate(`/project/${id}`);
  };
  return (
    <Box mb={4} fontSize={20}>
      <Text textAlign="center">{user.name}'s Projects</Text>
      {projects.map((project: ProjectType) => {
        return (
          <Box
            key={project.name}
            m={10}
            onClick={() => onProjectClick(project.id)}
            _hover={{
              cursor: "pointer",
              backgroundColor: "var(--chakra-colors-blackAlpha-50)"
            }}
          >
            <Box display="flex" border="1px solid black" p={4} mb={6}>
              <Text w="15%">{project.name}</Text>
              <Text flex={1} isTruncated>
                {project.description}
              </Text>
              <Text w="15%" ml={10}>
                {project.status}
              </Text>
            </Box>
          </Box>
        );
      })}
      <Box m={10}>
        <CreateProjectAccordion projects={projects} setProjects={setProjects} />
      </Box>
    </Box>
  );
};

export { Projects };
