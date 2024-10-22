import { DeleteIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Text
} from "@chakra-ui/react";
import { CreateTaskAccordion } from "../Tasks";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UserStory } from "../Features";

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
  userStoryTask: Task[];
};

const sampleDevTasks = [
  {
    name: "Dev Task 1",
    status: "To Do"
  },
  {
    name: "Dev Task 2",
    status: "To Do"
  },
  {
    name: "Dev Task 3",
    status: "To Do"
  },
  {
    name: "Dev Task 4",
    status: "To Do"
  }
];

function UserStoryDetailsAccordion({
  name,
  status,
  description,
  featureId,
  projectId,
  userStoryId,
  userStoryTask
}: Props) {
  const [tasks, setTasks] = useState(userStoryTask);
  useEffect(() => {
    setTasks(userStoryTask);
  }, [userStoryTask]);

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
              <Text>{status}</Text>
              <DeleteIcon />
              <AccordionIcon />
            </Box>
          </AccordionButton>
        </Box>
        <AccordionPanel border="1px solid black" borderTop="none" p={0}>
          <Box p={4} pb={10}>
            {description || "There is no user story description"}
          </Box>
          {tasks?.map((task) => {
            return (
              <Box
                key={task.id}
                px={4}
                py={3}
                borderTop="1px solid black"
                w="100%"
                display="flex"
                justifyContent={"space-between"}
                alignItems="center"
              >
                <Text>{task.name}</Text>
                <Box display="flex" gap={4} alignItems="center">
                  <Button>{task.status}</Button>
                  <DeleteIcon />
                </Box>
              </Box>
            );
          })}
          <CreateTaskAccordion
            featureId={featureId}
            projectId={projectId}
            userStoryId={userStoryId}
            setTasks={setTasks}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export { UserStoryDetailsAccordion };
