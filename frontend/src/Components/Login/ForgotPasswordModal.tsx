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
  useDisclosure
} from "@chakra-ui/react";
import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
const ForgotPasswordModal = ({ isOpen, onClose }: Props) => {
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
            <Input
              // value={valueState}
              // onChange={onChange}
              autoFocus
              // type={field === "password" ? "password" : "text"}
            />
          </Box>
        </ModalBody>

        <Button onClick={onClose} mx={6} mb={4} mt={2}>
          Send Verification Email
        </Button>
      </ModalContent>
    </Modal>
  );
};

export { ForgotPasswordModal };
