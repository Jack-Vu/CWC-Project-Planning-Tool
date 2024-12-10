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
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ProjectType } from "../../Pages";
import { Context } from "../../App";

type Props = {
  featureId: number;
  projectId: number;
  setProject: Dispatch<SetStateAction<ProjectType>>;
};

const CreateUserStoryAccordion = ({
  featureId,
  projectId,
  setProject
}: Props) => {
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
          "http://localhost:3025/auth/create-user-story",
          {
            name,
            description,
            projectId,
            featureId
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        .then((response) => {
          setName("");
          setDescription("");
          setProject(response.data);
          setCreateButtonClicked(false);
          setIsOpen(false);
          toast({
            title: "Success.",
            description: "Your user story has been created!",
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
                "There was an error creating your user story. Please try again!",
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
                  as="span"
                  flex="1"
                  textAlign="left"
                  ml={3}
                  p={2}
                  color="white"
                >
                  Add a user story
                </Box>
              </AccordionButton>
            </h2>
            <AccordionPanel
              pb={4}
              borderLeft="1px solid #170c35"
              borderRight="1px solid #170c35"
              borderBottom="1px solid #170c35"
              layerStyle="accordionPanel"
            >
              <FormControl isRequired isInvalid={isNameError} mb={2}>
                <FormLabel layerStyle="text">User Story Name:</FormLabel>
                <Input
                  onChange={onChangeName}
                  name="name"
                  type="text"
                  value={name}
                  layerStyle="text"
                />
                {isNameError && (
                  <FormErrorMessage>
                    User Story name is required.
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl mb={4}>
                <FormLabel layerStyle="text">User Story Description:</FormLabel>
                <Textarea
                  onChange={onChangeDescription}
                  name="description"
                  value={description}
                  layerStyle="text"
                />
              </FormControl>
              <Button
                colorScheme="green"
                onClick={onSubmit}
                display="flex"
                w="100%"
              >
                Create User Story
              </Button>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export { CreateUserStoryAccordion };
