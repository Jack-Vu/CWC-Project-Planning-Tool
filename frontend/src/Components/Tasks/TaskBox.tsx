import { CheckIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Input,
  Text,
  useToast
} from "@chakra-ui/react";
import { Task } from "../UserStories";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Props = {
  task: Task;
  setStoryStatus: Dispatch<SetStateAction<string>>;
};

const TaskBox = ({ task, setStoryStatus }: Props) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [taskStatus, setTaskStatus] = useState(task.status);
  const [taskName, setTaskName] = useState(task.name);
  const [updateName, setUpdateName] = useState(false);

  const onClickEdit = () => {
    setUpdateName(!updateName);
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };

  const updateTask = (field: "status" | "name", value: string) => {
    const token = localStorage.getItem("token");
    if (!value) {
      toast({
        title: "Error.",
        description: "Please enter a task!",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      setTaskName(task.name);
      return;
    } else {
      axios
        .post(
          "http://localhost:3025/auth/update-task",
          {
            field,
            value,
            taskId: task.id
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        .then((response) => {
          setStoryStatus(response.data);
          setUpdateName(false);
          toast({
            title: "Success.",
            description: `Your task ${field} has been updated!`,
            status: "success",
            duration: 3000,
            isClosable: true
          });
        })
        .catch((error) => {
          if (error.response.data.message === "Unauthorized") {
            toast({
              title: "Error.",
              description: "Your session has expired, please log in again!",
              status: "error",
              duration: 3000,
              isClosable: true
            });
            navigate("/log-in");
          } else {
            toast({
              title: "Error.",
              description:
                "There was an error updating your task. Please try again!",
              status: "error",
              duration: 3000,
              isClosable: true
            });
          }
        });
    }
  };

  const toggleTaskStatus = () => {
    if (taskStatus === "To Do") {
      setTaskStatus("In Progress");
      updateTask("status", "In Progress");
    } else if (taskStatus === "In Progress") {
      setTaskStatus("Done!");
      updateTask("status", "Done!");
    } else {
      setTaskStatus("To Do");
      updateTask("status", "To Do");
    }
  };
  return (
    <Box
      px={4}
      py={3}
      borderTop="1px solid black"
      w="100%"
      display="flex"
      alignItems="center"
    >
      <Box display="flex" flex={1} alignItems="center">
        {updateName ? (
          <Input
            h="40px"
            value={taskName}
            onChange={onChange}
            autoFocus
            type={"text"}
          />
        ) : (
          <Text textAlign="left">{task.name}</Text>
        )}
      </Box>

      <Box display="flex" gap={2} alignItems="center">
        <IconButton
          aria-label={`Edit task`}
          icon={updateName ? <CheckIcon /> : <EditIcon />}
          onClick={
            updateName ? () => updateTask("name", taskName) : onClickEdit
          }
          marginLeft={2}
        />
        <Button w="118px" onClick={toggleTaskStatus}>
          {taskStatus}
        </Button>
        <DeleteIcon />
      </Box>
    </Box>
  );
};

export { TaskBox };
