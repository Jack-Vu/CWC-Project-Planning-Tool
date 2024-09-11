import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Input,
  Text,
  useEditableControls,
  useToast
} from "@chakra-ui/react";
import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import { Context, Data } from "../App";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";

const Profile = () => {
  const data = useLoaderData() as Data;
  const navigate = useNavigate();
  const toast = useToast();
  const context = useOutletContext() as Context;
  console.log(data);

  const onLogOut = () => {
    localStorage.removeItem("token");
    context.toggledLoggedIn();
    navigate("/log-in");
    toast({
      title: "Success.",
      description: "You've been logged out of your account",
      status: "success",
      duration: 3000,
      isClosable: true
    });
  };

  return (
    <>
      <Text textAlign="center" mb={4} fontSize="20px">
        Account Details
      </Text>
      <Text fontSize={20} textAlign="center" mb={4}>
        Welcome {data.name}! You can manage your account details here.
      </Text>
      <Box
        display="flex"
        alignItems="center"
        margin="0 auto"
        py={20}
        w="60%"
        gap={10}
      >
        <Avatar size="2xl" name={data.name}></Avatar>
        <Box w="100%" display="flex" flexDirection="column" gap={3}>
          <Box display="flex" alignItems="center">
            <Text flex={1} lineHeight="32px">
              Name:
            </Text>
            <Editable
              textAlign="left"
              defaultValue={data.name}
              fontSize="medium"
              isPreviewFocusable={false}
              display="flex"
              w="60%"
              justifyContent="space-between"
            >
              <EditablePreview />
              <Input as={EditableInput} />
              <EditableControls />
            </Editable>
          </Box>
          <Box display="flex">
            <Text flex={1} lineHeight="32px">
              Email Address:
            </Text>
            <Editable
              textAlign="left"
              defaultValue={data.email}
              fontSize="medium"
              isPreviewFocusable={false}
              display="flex"
              w="60%"
              justifyContent="space-between"
            >
              <EditablePreview />
              <Input as={EditableInput} />
              <EditableControls />
            </Editable>
          </Box>
          <Box display="flex">
            <Text flex={1} lineHeight="32px">
              Username:
            </Text>
            <Editable
              textAlign="left"
              defaultValue={data.username}
              fontSize="medium"
              isPreviewFocusable={false}
              display="flex"
              w="60%"
              justifyContent="space-between"
            >
              <EditablePreview />
              <Input as={EditableInput} />
              <EditableControls />
            </Editable>
          </Box>
          <Box display="flex">
            <Text flex={1} lineHeight="32px">
              Password:
            </Text>
            <Editable
              textAlign="left"
              defaultValue="*********"
              fontSize="medium"
              isPreviewFocusable={false}
              display="flex"
              w="60%"
              justifyContent="space-between"
            >
              <EditablePreview />
              <Input as={EditableInput} />
              <EditableControls />
            </Editable>
          </Box>
        </Box>
      </Box>
      <Box>
        <Button onClick={onLogOut}>Log Out</Button>
      </Box>
    </>
  );
};

export { Profile };

function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps
  } = useEditableControls();

  return isEditing ? (
    <Flex alignItems="center" justifyContent="center">
      <IconButton
        size="sm"
        aria-label="button"
        icon={<CheckIcon />}
        {...getSubmitButtonProps()}
      />
    </Flex>
  ) : (
    <Flex alignItems="center" justifyContent="center">
      <IconButton
        size="sm"
        aria-label="button"
        icon={<EditIcon />}
        {...getEditButtonProps()}
      />
    </Flex>
  );
}
