import { DeleteIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text
} from "@chakra-ui/react";
import { CreateTaskAccordion, TaskBox } from "../Tasks";
import { Dispatch, SetStateAction, useState } from "react";
import { ProjectType } from "../../Pages";

export type Task = {
  id: number;
  name: string;
  status: string;
};

type Props = {
  name: string;
  status: string;
  description: string;
  featureId: number;
  projectId: number;
  userStoryId: number;
  tasks: Task[];
  setProject: Dispatch<SetStateAction<ProjectType>>;
};

function UserStoryDetailsAccordion({
  name,
  status,
  description,
  featureId,
  projectId,
  userStoryId,
  tasks,
  setProject
}: Props) {
  
  const [storyStatus, setStoryStatus] = useState(status);

  return (
    <Accordion allowToggle>
      <AccordionItem borderTop="none">
        <Box
          border="1px solid black"
          w="100%"
          h="58px"
          mt={4}
          display="flex"
          justifyContent="space-between"
        >
          <AccordionButton p={4}>
            <Box flex={1} textAlign="left">
              <Text>{name}</Text>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Text>{storyStatus}</Text>
              <DeleteIcon />
              <AccordionIcon />
            </Box>
          </AccordionButton>
        </Box>
        <AccordionPanel border="1px solid black" borderTop="none" p={0}>
          <Box p={4} pb={10}>
            {description || "There is no user story description..."}
          </Box>
          {tasks?.map((task) => {
            return (
              <Box key={task.id}>
                <TaskBox task={task} setStoryStatus={setStoryStatus} />
              </Box>
            );
          })}
          <CreateTaskAccordion
            featureId={featureId}
            projectId={projectId}
            userStoryId={userStoryId}
            setProject={setProject}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export { UserStoryDetailsAccordion };
