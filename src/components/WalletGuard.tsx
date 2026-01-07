"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  VStack,
  Text,
  Icon,
  useDisclosure,
  useToast,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { FiWifi, FiWifiOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ReactNode } from "react";

interface WalletGuardProps {
  children: ReactNode;
  requireWallet?: boolean;
}

export function WalletGuard({ children, requireWallet = false }: WalletGuardProps) {
  const { isConnected } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (requireWallet && !isConnected) {
      onOpen();
    } else if (isConnected && isOpen) {
      // Wallet connected successfully - show toast
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet on Mantle Network",
        status: "success",
        duration: 3000,
      });
      onClose();
    }
  }, [requireWallet, isConnected, onOpen, isOpen, onClose, toast]);

  if (!requireWallet) {
    return <>{children}</>;
  }

  if (!isConnected) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => { }}
        isCentered
        closeOnOverlayClick={false}
        motionPreset="slideInBottom"
        size="lg"
      >
        <ModalOverlay
          bg="blackAlpha.700"
          backdropFilter="blur(20px)"
        />
        <ModalContent
          borderRadius="3xl"
          overflow="hidden"
          boxShadow="0 25px 50px -12px rgba(102, 126, 234, 0.4)"
          bg="white"
          _dark={{ bg: "gray.800" }}
          borderWidth="1px"
          borderColor="rgba(118, 75, 162, 0.2)"
        >
          <Box
            bgGradient="linear(to-br, purple.600, blue.600)"
            py={10}
            position="relative"
            overflow="hidden"
          >
            {/* Decorative background orbs */}
            <Box
              position="absolute"
              top="-20%"
              right="-10%"
              w="200px"
              h="200px"
              bg="whiteAlpha.200"
              borderRadius="full"
              filter="blur(40px)"
            />
            <Box
              position="absolute"
              bottom="-20%"
              left="-10%"
              w="150px"
              h="150px"
              bg="purple.800"
              borderRadius="full"
              filter="blur(30px)"
              opacity={0.5}
            />

            <ModalHeader position="relative">
              <VStack spacing={4}>
                <Box
                  p={4}
                  bg="whiteAlpha.200"
                  borderRadius="full"
                  backdropFilter="blur(10px)"
                  boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
                >
                  <Icon as={FiWifiOff} boxSize={12} color="white" />
                </Box>
                <Text
                  fontSize="2xl"
                  fontWeight="900"
                  color="white"
                  letterSpacing="tight"
                  fontFamily="Outfit"
                >
                  Wallet Connection Required
                </Text>
              </VStack>
            </ModalHeader>
          </Box>

          <ModalBody py={8} px={8}>
            <VStack spacing={5} textAlign="center">
              <Text color="gray.700" _dark={{ color: "gray.300" }} fontSize="lg" fontWeight="600" fontFamily="Outfit">
                You need to connect your wallet to access this page.
              </Text>
              <Text fontSize="md" color="gray.600" _dark={{ color: "gray.400" }} lineHeight="1.7" fontFamily="Inter">
                Connect your wallet to view properties, make investments, and manage your portfolio on Mantle Network.
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter bg="gray.50" _dark={{ bg: "gray.900" }} py={6} px={8}>
            <VStack spacing={3} width="full">
              <Flex justify="center" width="full">
                <ConnectButton />
              </Flex>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return <>{children}</>;
}