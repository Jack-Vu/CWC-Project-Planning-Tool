import {
  CheckIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon
} from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  IconButton,
  Input,
  Text,
  Textarea,
  useDisclosure,
  useMediaQuery,
  useToast
} from "@chakra-ui/react";
import { CreateTaskAccordion, TaskBox } from "../Tasks";
import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState
} from "react";
import { ProjectType } from "../../Pages";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { DeleteModal } from "../DeleteModal";
import { Context } from "../../App";

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
  const toast = useToast();
  const navigate = useNavigate();
  const context = useOutletContext() as Context;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isLargerThan900] = useMediaQuery("(min-width: 900px)");

  const [storyStatus, setStoryStatus] = useState(status);
  const [storyName, setStoryName] = useState(name);
  const [storyDescription, setStoryDescription] = useState(description);
  const [updateStoryName, setUpdateStoryName] = useState(false);
  const [updateStoryDescription, setUpdateStoryDescription] = useState(false);
  const [taskList, setTaskList] = useState(tasks);

  useEffect(() => {
    setStoryStatus(status);
    setTaskList(tasks);
  }, [status, tasks]);

  const onClickEditName = () => {
    setUpdateStoryName(!updateStoryName);
  };
  const onClickEditDescription = () => {
    setUpdateStoryDescription(!updateStoryDescription);
  };
  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setStoryName(e.target.value);
  };
  const onChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setStoryDescription(e.target.value);
  };
  const updateUserStory = (field: "name" | "description", value: string) => {
    const token = localStorage.getItem("token");
    if (field === "name" && name === storyName) {
      setUpdateStoryName(false);
      return;
    }
    if (field === "description" && description === storyDescription) {
      setUpdateStoryDescription(false);
      return;
    }
    if (storyName === "") {
      toast({
        title: "Error.",
        description: "Please enter a valid user story name!",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      setStoryName(name);
      return;
    } else {
      axios
        .post(
          "http://localhost:3025/auth/update-user-story",
          {
            field,
            value,
            userStoryId
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        .then((response) => {
          setProject(response.data);
          if (field === "name") {
            setUpdateStoryName(false);
          } else {
            setUpdateStoryDescription(false);
          }
          toast({
            title: "Success.",
            description: `Your user story ${field} has been updated!`,
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
                "There was an error updating your user story. Please try again!",
              status: "error",
              duration: 3000,
              isClosable: true
            });
          }
        });
    }
  };

  const deleteStory = () => {
    const token = localStorage.getItem("token");

    axios
      .post(
        "http://localhost:3025/auth/delete-user-story",
        {
          userStoryId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then((response) => {
        setProject(response.data);
        toast({
          title: "Success.",
          description: "Your user story has been deleted!",
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
              "There was an error deleting your user story. Please try again!",
            status: "error",
            duration: 3000,
            isClosable: true
          });
        }
      });
  };
  return (
    <>
      {updateStoryName ? (
        <Box
          mt={4}
          border="1px solid #170c35"
          borderRadius="md"
          w="100%"
          h="66px"
          p={4}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={3}
        >
          <Input
            value={storyName}
            onChange={onChangeName}
            h="32px"
            autoFocus
            type={"text"}
            layerStyle="text"
          />

          <IconButton
            size="sm"
            colorScheme="green"
            aria-label={`Edit User Story`}
            icon={<CheckIcon />}
            onClick={() => {
              updateUserStory("name", storyName);
            }}
          />
          <Box display="flex" alignItems="center" gap={3}>
            <Text layerStyle="text">{storyStatus}</Text>
            <IconButton
              size="sm"
              colorScheme="green"
              aria-label="Delete Task"
              icon={<DeleteIcon />}
              onClick={onOpen}
            />
            <ChevronDownIcon boxSize={5} />
          </Box>
        </Box>
      ) : (
        <Accordion allowToggle>
          <AccordionItem border="none">
            {({ isExpanded }) => (
              <>
                <AccordionButton
                  mt={4}
                  h={isLargerThan900 ? "66px" : "fit-content"}
                  p={4}
                  display="flex"
                  alignItems="center"
                  gap={3}
                  layerStyle="boxButton"
                  borderBottomRadius={isExpanded ? "none" : "md"}
                  _hover={
                    isExpanded
                      ? {}
                      : {
                          cursor: "pointer",
                          transform: "scale(1.005)"
                        }
                  }
                  _active={isExpanded ? {} : { transform: "scale(1)" }}
                  flexDir={isLargerThan900 ? "row" : "column-reverse"}
                >
                  <Text
                    w="100%"
                    textAlign={isLargerThan900 ? "left" : "center"}
                    flex={1}
                    layerStyle="text"
                  >
                    {storyName}
                  </Text>

                  <Box display="flex" alignItems="center" gap={3}>
                    <Text layerStyle="text">{storyStatus}</Text>
                    <IconButton
                      size="sm"
                      colorScheme="green"
                      aria-label={`Edit User Story`}
                      icon={<EditIcon />}
                      onClick={onClickEditName}
                      marginLeft={2}
                    />
                    <IconButton
                      size="sm"
                      colorScheme="green"
                      aria-label="Delete Task"
                      icon={<DeleteIcon />}
                      onClick={(e: MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        onOpen();
                      }}
                    />
                    <AccordionIcon />
                  </Box>
                </AccordionButton>
                <AccordionPanel
                  p={0}
                  borderLeft="1px solid #170c35"
                  borderRight="1px solid #170c35"
                  borderBottom="1px solid #170c35"
                  layerStyle="accordionPanel"
                >
                  <Box
                    p={4}
                    pb={10}
                    textAlign="left"
                    display="flex"
                    gap={3}
                    borderBottom="1px solid #170c35"
                  >
                    {updateStoryDescription ? (
                      <Textarea
                        value={storyDescription}
                        onChange={onChangeDescription}
                        autoFocus
                        flex={1}
                        layerStyle="text"
                      />
                    ) : (
                      <Text
                        textAlign="left"
                        layerStyle="text"
                        mr={4}
                        lineHeight="32px"
                      >
                        {storyDescription ||
                          "There is no user story description..."}
                      </Text>
                    )}
                    <IconButton
                      size="sm"
                      colorScheme="green"
                      aria-label={`Edit User Story`}
                      icon={
                        updateStoryDescription ? <CheckIcon /> : <EditIcon />
                      }
                      onClick={
                        updateStoryDescription
                          ? () =>
                              updateUserStory("description", storyDescription)
                          : onClickEditDescription
                      }
                    />
                  </Box>
                  <Box
                    m={5}
                    display="flex"
                    flexDir="column"
                    gap={4}
                    borderRadius="md"
                  >
                    {taskList?.map((task) => {
                      return (
                        <TaskBox
                          key={task.id}
                          task={task}
                          setStoryStatus={setStoryStatus}
                          setTaskList={setTaskList}
                        />
                      );
                    })}
                    <CreateTaskAccordion
                      featureId={featureId}
                      projectId={projectId}
                      userStoryId={userStoryId}
                      setProject={setProject}
                    />
                  </Box>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
      )}
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        deleteItem={deleteStory}
        itemType="user story"
      />
    </>
  );
}

export { UserStoryDetailsAccordion };
