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
  useToast
} from "@chakra-ui/react";
import { CreateTaskAccordion, TaskBox } from "../Tasks";
import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useState
} from "react";
import { ProjectType } from "../../Pages";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [storyStatus, setStoryStatus] = useState(status);
  const [storyName, setStoryName] = useState(name);
  const [storyDescription, setStoryDescription] = useState(description);
  const [updateName, setUpdateName] = useState(false);
  const [updateDescription, setUpdateDescription] = useState(false);

  const onClickEditName = () => {
    setUpdateName(!updateName);
  };
  const onClickEditDescription = () => {
    setUpdateDescription(!updateDescription);
  };
  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setStoryName(e.target.value);
  };
  const onChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setStoryDescription(e.target.value);
  };
  const updateUserStory = (field: "name" | "description", value: string) => {
    const token = localStorage.getItem("token");
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
          setProject(response.data)
          if (field === "name") {
            setUpdateName(false);
          } else {
            setUpdateDescription(false);
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
  return (
    <>
      {updateName ? (
        <Box
          mt={4}
          border="1px solid black"
          w="100%"
          h="58px"
          p={4}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Input
            value={storyName}
            onChange={onChangeName}
            h="40px"
            autoFocus
            type={"text"}
          />

          <IconButton
            aria-label={`Edit User Story`}
            icon={<CheckIcon />}
            onClick={() => {
              updateUserStory("name", storyName);
            }}
            marginLeft={2}
          />
          <Box display="flex" alignItems="center" gap={2}>
            <Text>{storyStatus}</Text>
            <DeleteIcon />
            <ChevronDownIcon boxSize={5} />
          </Box>
        </Box>
      ) : (
        <Accordion allowToggle>
          <AccordionItem borderTop="none">
            <AccordionButton
              mt={4}
              border="1px solid black"
              w="100%"
              h="58px"
              p={4}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
            >
              <Text textAlign="left" flex={1}>
                {storyName}
              </Text>

              <IconButton
                aria-label={`Edit User Story`}
                icon={<EditIcon />}
                onClick={onClickEditName}
                marginLeft={2}
              />

              <Box display="flex" alignItems="center" gap={2}>
                <Text>{storyStatus}</Text>
                <DeleteIcon />
                <AccordionIcon />
              </Box>
            </AccordionButton>
            <AccordionPanel border="1px solid black" borderTop="none" p={0}>
              <Box
                p={4}
                pb={10}
                textAlign="left"
                display="flex"
                alignItems="center"
              >
                {updateDescription ? (
                  <Input
                    value={storyDescription}
                    onChange={onChangeDescription}
                    autoFocus
                    type={"text"}
                  />
                ) : (
                  <Text textAlign="left">{storyDescription}</Text>
                )}
                <IconButton
                  aria-label={`Edit User Story`}
                  icon={updateDescription ? <CheckIcon /> : <EditIcon />}
                  onClick={
                    updateDescription
                      ? () => updateUserStory("description", storyDescription)
                      : onClickEditDescription
                  }
                  marginLeft={2}
                />
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
      )}
    </>
  );
}

export { UserStoryDetailsAccordion };
