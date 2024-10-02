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
import { Feature } from "../../Pages";
import axios from "axios";

type Props = {
  setFeatures: Dispatch<SetStateAction<Feature[]>>;
  projectId: number;
};

const CreateFeatureAccordion = ({ projectId, setFeatures }: Props) => {
  const toast = useToast();
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
          "http://localhost:3025/auth/create-feature",
          {
            name,
            description,
            id: projectId
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        .then((response) => {
          setFeatures(response.data);
          setName("");
          setDescription("");
          setCreateButtonClicked(false);
          setIsOpen(false);
          toast({
            title: "Success.",
            description: "Your feature has been created!",
            status: "success",
            duration: 3000,
            isClosable: true
          });
        })
        .catch((error) => {
          //add error handling if token expired
          console.log("Error", error);
          toast({
            title: "Error.",
            description:
              "There was an error creating your feature. Please try again!",
            status: "error",
            duration: 3000,
            isClosable: true
          });
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
                  Add a feature
                </Box>
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} borderTop="1px solid black" textAlign="left">
              <FormControl isRequired isInvalid={isNameError} mb={2}>
                <FormLabel>Feature Name:</FormLabel>
                <Input
                  onChange={onChangeName}
                  name="name"
                  type="text"
                  value={name}
                />
                {isNameError && (
                  <FormErrorMessage>Feature name is required.</FormErrorMessage>
                )}
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Feature Description:</FormLabel>
                <Textarea
                  onChange={onChangeDescription}
                  name="description"
                  value={description}
                />
              </FormControl>
              <Button onClick={onSubmit} display="flex" w="100%">
                Create Feature
              </Button>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export { CreateFeatureAccordion };
