import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Input,
  Text,
  useEditableControls
} from "@chakra-ui/react";
import React from "react";

type Props = {
  field: string;
  value: string;
};

const UserDetailsRow = ({ field, value }: Props) => {
  return (
    <Box display="flex" alignItems="center">
      <Text flex={1} lineHeight="32px">
        {field}:
      </Text>
      <Editable
        textAlign="left"
        defaultValue={value}
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
  );
};

export { UserDetailsRow };

function EditableControls() {
  const { isEditing, getSubmitButtonProps, getEditButtonProps } =
    useEditableControls();

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
