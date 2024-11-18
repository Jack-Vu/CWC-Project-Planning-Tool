import { Box, Heading, Text } from "@chakra-ui/react";
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
    <Box mt={20}>
      <Heading layerStyle="heading" mb={4} fontSize={28} textAlign="center">
        {user.name}'s Projects
      </Heading>
      {projects.map((project: ProjectType) => {
        return (
          <Box
            key={project.id}
            m={10}
            onClick={() => onProjectClick(project.id)}
            _hover={{
              cursor: "pointer",
              backgroundColor: "var(--chakra-colors-blackAlpha-50)"
            }}
          >
            <Box display="flex" border="1px solid black" p={4} mb={6}>
              <Text layerStyle="text" w="15%">
                {project.name}
              </Text>
              <Text layerStyle="text" flex={1} isTruncated>
                {project.description}
              </Text>
              <Text layerStyle="text" w="15%" ml={10}>
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
