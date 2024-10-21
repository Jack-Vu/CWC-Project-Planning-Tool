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
import { UserStory } from "../Features";
import { useNavigate } from "react-router-dom";

type Props = {
  setUserStories: Dispatch<SetStateAction<UserStory[]>>;
  featureId: number;
  projectId: number;
};

const CreateUserStoryAccordion = ({
  featureId,
  projectId,
  setUserStories
}: Props) => {
  const toast = useToast();
  const navigate = useNavigate();
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
          console.log(response.data);

          setUserStories(response.data);
          setName("");
          setDescription("");
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
      <AccordionItem border="1px solid black">
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
                <Box as="span" flex="1" textAlign="left" ml={3} p={2}>
                  Add a user story
                </Box>
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} borderTop="1px solid black" textAlign="left">
              <FormControl isRequired isInvalid={isNameError} mb={2}>
                <FormLabel>User Story Name:</FormLabel>
                <Input
                  onChange={onChangeName}
                  name="name"
                  type="text"
                  value={name}
                />
                {isNameError && (
                  <FormErrorMessage>
                    User Story name is required.
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>User Story Description:</FormLabel>
                <Textarea
                  onChange={onChangeDescription}
                  name="description"
                  value={description}
                />
              </FormControl>
              <Button onClick={onSubmit} display="flex" w="100%">
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
