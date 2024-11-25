import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { CreateFeatureAccordion, FeatureBox } from "../Features";
import { ProjectType } from "../../Pages";

type Column = {
  name: string;
};
type Props = {
  project: ProjectType;
  column: Column;
  setProject: React.Dispatch<React.SetStateAction<ProjectType>>;
};

const StatusColumn = ({ column, project, setProject }: Props) => {

  return (
    <Box
      key={column.name}
      border="1px solid #170c35"
      borderRadius="md"
      bgColor="white"
      flex={1}
      minW="275px"
      minH="100px"
    >
      <Text layerStyle="text" textAlign="center" fontSize={20} mt={2}>
        {column.name}
      </Text>
      {project.features.map((feature) => {
        if (feature.status === column.name) {
          return (
            <FeatureBox
              key={feature.id}
              feature={feature}
              projectId={project.id}
              setProject={setProject}
            />
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
};

export { StatusColumn };
