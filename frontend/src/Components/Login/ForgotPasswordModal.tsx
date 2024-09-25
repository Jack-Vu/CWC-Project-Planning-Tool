import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { isInvalidEmail } from "../../Pages";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
const ForgotPasswordModal = ({ isOpen, onClose }: Props) => {
  const toast = useToast();

  const [email, setEmail] = useState("");

  const saveEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const submitEmail = () => {
    const invalidEmail = isInvalidEmail(email);
    console.log(invalidEmail);
    if (invalidEmail) {
      toast({
        title: "Error.",
        description: "Please enter a valid email address!",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } else {
      axios
        .post("http://localhost:3025/auth/reset-password", {
          email
        })
        .then((response) => {
          console.log("Response:", response);
          toast({
            title: "Success.",
            description: "Check your email account for further directions",
            status: "success",
            duration: 3000,
            isClosable: true
          });
        })
        .catch((error) => {
          console.log("Error", error);
          toast({
            title: "Error.",
            description: error.response.data.message,
            status: "error",
            duration: 3000,
            isClosable: true
          });
        });
    }
    setEmail("");
    console.log("Email", email);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text mb={4}>
              Enter the email address associated with your account:
            </Text>
            <Input value={email} onChange={saveEmail} autoFocus />
          </Box>
        </ModalBody>

        <Button onClick={submitEmail} mx={6} mb={4} mt={2}>
          Send Verification Email
        </Button>
      </ModalContent>
    </Modal>
  );
};

export { ForgotPasswordModal };
