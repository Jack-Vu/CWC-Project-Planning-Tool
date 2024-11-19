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
  setTaskList: Dispatch<SetStateAction<Task[]>>;
};

const TaskBox = ({ task, setStoryStatus, setTaskList }: Props) => {
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
  const deleteTask = () => {
    const token = localStorage.getItem("token");

    axios
      .post(
        "http://localhost:3025/auth/delete-task",
        {
          taskId: task.id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then((response) => {
        setStoryStatus(response.data.storyStatus);
        setTaskList(response.data.taskList);
        toast({
          title: "Success.",
          description: "Your task has been deleted!",
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
              "There was an error deleting your task. Please try again!",
            status: "error",
            duration: 3000,
            isClosable: true
          });
        }
      });
  };

  return (
    <Box
      p={4}
      border="1px solid #170c35"
      borderRadius="md"
      bgColor="white"
      boxShadow="md"
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
          <Text textAlign="left">{taskName}</Text>
        )}
      </Box>

      <Box marginLeft={2} display="flex" gap={2} alignItems="center">
        <Button
          size="sm"
          colorScheme="green"
          w="118px"
          onClick={toggleTaskStatus}
        >
          {taskStatus}
        </Button>
        <IconButton
          size="sm"
          colorScheme="green"
          aria-label={`Edit task`}
          icon={updateName ? <CheckIcon /> : <EditIcon />}
          onClick={
            updateName ? () => updateTask("name", taskName) : onClickEdit
          }
          
        />
        <IconButton
          size="sm"
          colorScheme="green"
          aria-label="Delete Task"
          icon={<DeleteIcon />}
          onClick={deleteTask}
        />
      </Box>
    </Box>
  );
};

export { TaskBox };
