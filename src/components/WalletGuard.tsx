"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Text,
  Icon,
  useDisclosure,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useDappKit } from "@/hooks/useDappKit";
import { useEffect, ReactNode, useState } from "react";
import { FiAlertCircle, FiWifi, FiWifiOff } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface WalletGuardProps {
  children: ReactNode;
  requireWallet?: boolean;
}

export function WalletGuard({ children, requireWallet = false }: WalletGuardProps) {
  const { isConnected, connect } = useDappKit();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (requireWallet && !isConnected) {
      onOpen();
    } else if (isConnected && isOpen) {
      // Wallet connected successfully - show toast
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
        status: "success",
        duration: 3000,
      });
      onClose();
    }
  }, [requireWallet, isConnected, onOpen, isOpen, onClose, toast]);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    
    try {
      await connect();
      // Success will be handled by useEffect when isConnected changes
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error';
      
      if (errorMessage.includes('rejected') || 
          errorMessage.includes('cancelled') ||
          errorMessage.includes('denied')) {
        toast({
          title: "Connection Cancelled",
          description: "Wallet connection was cancelled. Please try again.",
          status: "warning",
          duration: 4000,
        });
      } else if (errorMessage.includes('not found') || 
                 errorMessage.includes('not installed')) {
        toast({
          title: "Wallet Not Found",
          description: "Please install a compatible wallet (OneWallet, Sui Wallet)",
          status: "error",
          duration: 5000,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Unable to connect to wallet. Please try again.",
          status: "error",
          duration: 4000,
        });
      }
    } finally {
      setIsConnecting(false);
    }
  };

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
                  <Icon as={isConnecting ? FiWifi : FiWifiOff} boxSize={12} color="white" />
                </Box>
                <Text
                  fontSize="2xl"
                  fontWeight="900"
                  color="white"
                  letterSpacing="tight"
                  fontFamily="Outfit"
                >
                  {isConnecting ? "Connecting..." : "Wallet Connection Required"}
                </Text>
              </VStack>
            </ModalHeader>
          </Box>

          <ModalBody py={8} px={8}>
            <VStack spacing={5} textAlign="center">
              <Text color="gray.700" _dark={{ color: "gray.300" }} fontSize="lg" fontWeight="600" fontFamily="Outfit">
                You need to connect your OneChain wallet to access this page.
              </Text>
              <Text fontSize="md" color="gray.600" _dark={{ color: "gray.400" }} lineHeight="1.7" fontFamily="Inter">
                Connect your wallet to view properties, make investments, and manage your portfolio.
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter bg="gray.50" _dark={{ bg: "gray.900" }} py={6} px={8}>
            <VStack spacing={3} width="full">
              <Button
                width="full"
                h="56px"
                fontSize="lg"
                fontWeight="700"
                borderRadius="xl"
                bgGradient="linear(to-r, purple.600, blue.600)"
                color="white"
                fontFamily="Outfit"
                onClick={handleConnectWallet}
                isLoading={isConnecting}
                loadingText="Connecting..."
                _hover={{
                  bgGradient: "linear(to-r, purple.500, blue.500)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              >
                Connect OneChain Wallet
              </Button>
              <Button
                variant="ghost"
                width="full"
                h="48px"
                fontSize="md"
                fontWeight="600"
                fontFamily="Outfit"
                color="gray.600"
                _dark={{ color: "gray.400" }}
                onClick={() => router.back()}
                isDisabled={isConnecting}
                _hover={{
                  bg: "gray.100",
                  color: "gray.800",
                }}
                transition="all 0.2s"
              >
                Go Back
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return <>{children}</>;
}