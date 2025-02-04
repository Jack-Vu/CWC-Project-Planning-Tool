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
  Textarea,
  useToast
} from "@chakra-ui/react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { ProjectType } from "../../Pages";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Context } from "../../App";

type Props = {
  projects: ProjectType[];
  setProjects: Dispatch<SetStateAction<ProjectType[]>>;
};

const CreateProjectAccordion = ({ projects, setProjects }: Props) => {
  const toast = useToast();
  const navigate = useNavigate();
  const context = useOutletContext() as Context;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createButtonClicked, setCreateButtonClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isNameError = name === "" && createButtonClicked;

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateButtonClicked(false);
    setName(e.target.value);
  };
  const onChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const onSubmit = () => {
    setCreateButtonClicked(true);
    if (name) {
      const token = localStorage.getItem("token");

      axios
        .post(
          "http://localhost:3025/auth/create-project",
          {
            name,
            description
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        .then((response) => {
          setProjects(response.data);
          setName("");
          setDescription("");
          setCreateButtonClicked(false);
          setIsOpen(false);
          toast({
            title: "Success.",
            description: "Your project has been created!",
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
                "There was an error creating your project. Please try again!",
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
      <AccordionItem border="none">
        {({ isExpanded }) => (
          <>
            <h2>
              <AccordionButton
                h="58px"
                layerStyle="accordionButton"
                borderBottomRadius={isExpanded ? "none" : "md"}
                _hover={
                  isExpanded
                    ? {
                        bgColor: "rgb(69, 98, 106, 0.75)"
                      }
                    : {
                        bgColor: "rgb(69, 98, 106, 0.75)",
                        transform: "scale(1.005)"
                      }
                }
                _active={isExpanded ? {} : { transform: "scale(1)" }}
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              >
                {isExpanded ? (
                  <MinusIcon color="white" fontSize="12px" />
                ) : (
                  <AddIcon color="white" fontSize="12px" />
                )}
                <Box
                  layerStyle="text"
                  color="white"
                  as="span"
                  flex="1"
                  textAlign="left"
                  ml={3}
                  p={2}
                >
                  Add a project
                </Box>
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} layerStyle="accordionPanel">
              <FormControl isRequired isInvalid={isNameError} mb={2}>
                <FormLabel layerStyle="text">Project Name:</FormLabel>
                <Input
                  onChange={onChangeName}
                  name="name"
                  type="text"
                  value={name}
                  layerStyle="text"
                />
                {isNameError && (
                  <FormErrorMessage layerStyle="text">
                    Project name is required.
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl mb={4}>
                <FormLabel layerStyle="text">Project Description:</FormLabel>
                <Textarea
                  onChange={onChangeDescription}
                  name="description"
                  value={description}
                  layerStyle="text"
                />
              </FormControl>
              <Button onClick={onSubmit} w="100%" colorScheme="green">
                Create Project
              </Button>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export { CreateProjectAccordion };
