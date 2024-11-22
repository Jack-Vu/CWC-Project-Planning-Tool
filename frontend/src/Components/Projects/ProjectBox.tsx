import { Box, Text, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { ProjectType } from "../../Pages";
import { useNavigate } from "react-router-dom";

type Props = {
  project: ProjectType;
};

const ProjectBox = ({ project }: Props) => {
  const navigate = useNavigate();
  const [isLargerThan795] = useMediaQuery("(min-width: 795px)");

  const onProjectClick = (id: number) => {
    navigate(`/project/${id}`);
  };

  return (
    <Box
      display="flex"
      flexDir={isLargerThan795 ? "row" : "column"}
      gap={isLargerThan795 ? 0 : 4}
      p={4}
      mb={6}
      onClick={() => onProjectClick(project.id)}
      layerStyle="boxButton"
    >
      <Text
        layerStyle="text"
        w={isLargerThan795 ? "15%" : "100%"}
        mr={5}
        isTruncated
        fontWeight={isLargerThan795 ? "normal" : "bold"}
        order={1}
      >
        {project.name}
      </Text>
      <Text
        layerStyle="text"
        flex={1}
        isTruncated={isLargerThan795}
        order={isLargerThan795 ? 2 : 3}
      >
        {project.description}
      </Text>
      <Text
        layerStyle="text"
        w={isLargerThan795 ? "15%" : "100%"}
        ml={isLargerThan795 ? 10 : 0}
        order={isLargerThan795 ? 3 : 2}
      >
        {project.status}
      </Text>
    </Box>
  );
};

export { ProjectBox };
