import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import { Box, IconButton, Input, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { isInvalidEmail } from "../../Pages";
import { Data } from "../../App";

type Props = {
  field: string;
  title: string;
  value: string;
  username: string;
  setData: React.Dispatch<React.SetStateAction<Data>>;
};

const UserDetailsRow = ({ field, title, value, username, setData }: Props) => {
  const toast = useToast();

  const [updateField, setUpdateField] = useState(false);
  const [valueState, setValueState] = useState(value);

  const onClickEdit = () => {
    if (field === "password") {
      setValueState("");
    }
    setUpdateField(!updateField);
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValueState(e.target.value);
  };
  const onClickCheck = () => {
    if (field === "email") {
      const invalidEmail = isInvalidEmail(valueState);
      console.log(invalidEmail);
      if (invalidEmail) {
        toast({
          title: "Error.",
          description: "Please enter a valid email!",
          status: "error",
          duration: 3000,
          isClosable: true
        });
        return;
      }
    }

    if (valueState === "") {
      toast({
        title: "Error.",
        description: "Please enter a valid value!",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return;
    }
    const token = localStorage.getItem("token");
    setUpdateField(!updateField);
    axios
      .post(
        "http://localhost:3025/auth/change-account-detail",
        {
          username: username,
          field,
          value: valueState
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        toast({
          title: "Success.",
          description: "We have updated your account details!",
          status: "success",
          duration: 3000,
          isClosable: true
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Error.",
          description:
            "There was an error. Please review your values and try again!",
          status: "error",
          duration: 3000,
          isClosable: true
        });
      });
  };
  return (
    <Box display="flex" alignItems="center">
      <Text flex={1} lineHeight="32px">
        {title}:
      </Text>
      {updateField ? (
        <Input
          flex={1}
          value={valueState}
          onChange={onChange}
          autoFocus
          type={field === "password" ? "password" : "text"}
        />
      ) : (
        <Text textAlign="left" flex={1}>
          {field === "password" ? "*********" : valueState}
        </Text>
      )}
      <IconButton
        aria-label={`Edit ${field}`}
        icon={updateField ? <CheckIcon /> : <EditIcon />}
        onClick={updateField ? onClickCheck : onClickEdit}
        marginLeft={2}
      />
    </Box>
  );
};

export { UserDetailsRow };
