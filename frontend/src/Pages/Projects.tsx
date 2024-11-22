import { Box, Heading, useMediaQuery } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { Data } from "../App";
import { CreateProjectAccordion, ProjectBox } from "../Components/Projects";
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
  const data = useLoaderData() as LoaderData;
  const [isLargerThan795] = useMediaQuery("(min-width: 795px)");

  const user = data.user as Data;
  const [projects, setProjects] = useState(data.projects);

  return (
    <Box mt={20}>
      <Heading layerStyle="heading" mb={4} fontSize={28} textAlign="center">
        {user.name}'s Projects
      </Heading>
      <Box my={10} mx={isLargerThan795 ? 10 : 4}>
        {projects.map((project: ProjectType) => {
          return (
            <Box key={project.id} w="100%">
              <ProjectBox project={project} />
            </Box>
          );
        })}
        <CreateProjectAccordion projects={projects} setProjects={setProjects} />
      </Box>
    </Box>
  );
};

export { Projects };
