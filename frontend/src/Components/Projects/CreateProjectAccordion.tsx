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
  Textarea
} from "@chakra-ui/react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Project } from "../../Pages";
import axios from "axios";

type Props = {
  projects: Project[];
  setProjects: Dispatch<SetStateAction<Project[]>>;
};

const CreateProjectAccordion = ({ projects, setProjects }: Props) => {
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
    // call create-project route on API to add project to database
    // on response, update project state with list of projects returned from API
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
          console.log("Response", response.data);
        });
      setProjects([
        ...projects,
        {
          name,
          description,
          status: "To Do"
        }
      ]);

      setName("");
      setDescription("");
      setCreateButtonClicked(false);
      setIsOpen(false);
    }
  };

  return (
    <Accordion allowToggle index={isOpen ? 0 : -1}>
      <AccordionItem border="1px solid black">
        {({ isExpanded }) => (
          <>
            <h2>
              <AccordionButton
                h="64px"
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
                  Add a project
                </Box>
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} borderTop="1px solid black" textAlign="left">
              <FormControl isRequired isInvalid={isNameError} mb={2}>
                <FormLabel>Project Name:</FormLabel>
                <Input
                  onChange={onChangeName}
                  name="name"
                  type="text"
                  value={name}
                />
                {isNameError && (
                  <FormErrorMessage>Project name is required.</FormErrorMessage>
                )}
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Project Description:</FormLabel>
                <Textarea
                  onChange={onChangeDescription}
                  name="description"
                  value={description}
                />
              </FormControl>
              <Button onClick={onSubmit} display="flex" m="0 0 0 auto">
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
