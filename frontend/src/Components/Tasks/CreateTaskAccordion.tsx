import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast
} from "@chakra-ui/react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ProjectType } from "../../Pages";

type Props = {
  featureId: number;
  projectId: number;
  userStoryId: number;
  setProject: Dispatch<SetStateAction<ProjectType>>;
};

const CreateTaskAccordion = ({
  featureId,
  projectId,
  userStoryId,
  setProject
}: Props) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [createButtonClicked, setCreateButtonClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isNameError = name === "" && createButtonClicked;

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateButtonClicked(false);
    setName(e.target.value);
  };

  const onSubmit = () => {
    setCreateButtonClicked(true);
    if (name) {
      const token = localStorage.getItem("token");
      axios
        .post(
          "http://localhost:3025/auth/create-task",
          {
            name,
            projectId,
            featureId,
            userStoryId
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        .then((response) => {
          setName("");
          setProject(response.data);
          setCreateButtonClicked(false);
          setIsOpen(false);
          toast({
            title: "Success.",
            description: "Your developer task has been created!",
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
                "There was an error creating your developer task. Please try again!",
              status: "error",
              duration: 3000,
              isClosable: true
            });
          }
        });
    }
  };
  return (
    <Accordion allowToggle index={isOpen ? 0 : -1}>
      <AccordionItem borderTop="1px solid black">
        {({ isExpanded }) => (
          <>
            <h2>
              <AccordionButton
                h="58px"
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              >
                {isExpanded ? (
                  <MinusIcon fontSize="12px" />
                ) : (
                  <AddIcon fontSize="12px" />
                )}
                <Box layerStyle="text" as="span" flex="1" textAlign="left" ml={3} p={2}>
                  Add a task
                </Box>
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} borderTop="1px solid black" textAlign="left">
              <FormControl isRequired isInvalid={isNameError} mb={2}>
                <FormLabel layerStyle="text">Task Name:</FormLabel>
                <Input
                  onChange={onChangeName}
                  name="name"
                  type="text"
                  value={name}
                  layerStyle="text"
                />
                {isNameError && (
                  <FormErrorMessage>
                    Developer task name is required.
                  </FormErrorMessage>
                )}
              </FormControl>
              <Button onClick={onSubmit} display="flex" w="100%">
                Create Task
              </Button>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export { CreateTaskAccordion };
