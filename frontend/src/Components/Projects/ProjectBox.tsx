import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { ProjectType } from "../../Pages";
import { useNavigate } from "react-router-dom";

type Props = {
  project: ProjectType;
};

const ProjectBox = ({ project }: Props) => {
  const navigate = useNavigate();
  const onProjectClick = (id: number) => {
    navigate(`/project/${id}`);
  };

  return (
    <Box
      mx={10}
      display="flex"
      p={4}
      mb={6}
      onClick={() => onProjectClick(project.id)}
      layerStyle="boxButton"
      h="58px"
    >
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
  );
};

export { ProjectBox };
