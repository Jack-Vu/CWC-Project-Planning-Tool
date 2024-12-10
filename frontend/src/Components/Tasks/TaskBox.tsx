import { CheckIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Text,
  Textarea,
  useMediaQuery,
  useToast
} from "@chakra-ui/react";
import { Task } from "../UserStories";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Context } from "../../App";

type Props = {
  task: Task;
  setStoryStatus: Dispatch<SetStateAction<string>>;
  setTaskList: Dispatch<SetStateAction<Task[]>>;
};

const TaskBox = ({ task, setStoryStatus, setTaskList }: Props) => {
  const toast = useToast();
  const navigate = useNavigate();
  const context = useOutletContext() as Context;

  const [isLargerThan900] = useMediaQuery("(min-width: 900px)");

  const [taskStatus, setTaskStatus] = useState(task.status);
  const [taskName, setTaskName] = useState(task.name);
  const [updateName, setUpdateName] = useState(false);

  const onClickEdit = () => {
    setUpdateName(!updateName);
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
            context.toggledLoggedIn();
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
          context.toggledLoggedIn();
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
      display="flex"
      flexDir={isLargerThan900 ? "row" : "column"}
      gap={4}
    >
      <Box
        display="flex"
        alignItems="center"
        flex={1}
        order={isLargerThan900 ? 1 : 2}
      >
        {updateName ? (
          <Textarea
            h="32px"
            value={taskName}
            onChange={onChange}
            autoFocus
            layerStyle={"text"}
          />
        ) : (
          <Text w="100%" lineHeight="32px" textAlign={isLargerThan900 ? "left" : "center"}>
            {taskName}
          </Text>
        )}
      </Box>

      <Box
        display="flex"
        gap={2}
        justifyContent={isLargerThan900 ? "none" : "center"}
        order={isLargerThan900 ? 2 : 1}
      >
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
