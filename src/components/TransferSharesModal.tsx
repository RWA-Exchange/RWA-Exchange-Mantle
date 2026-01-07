"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Progress,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { propertyContractService } from "@/services/propertyContract";

interface TransferSharesModalProps {
  isOpen: boolean;
  onClose: () => void;
  investmentId: string;
  propertyName: string;
  shares: number;
}

export function TransferSharesModal({
  isOpen,
  onClose,
  investmentId,
  propertyName,
  shares,
}: TransferSharesModalProps) {
  const { address, isConnected } = useAccount();
  const signer = useEthersSigner();
  const toast = useToast();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [sharesToTransfer, setSharesToTransfer] = useState(shares.toString());
  const [isTransferring, setIsTransferring] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleTransfer = async () => {
    if (!isConnected || !address || !signer) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (!recipientAddress || recipientAddress.length < 10) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid recipient address",
        status: "error",
        duration: 3000,
      });
      return;
    }

    const amountToTransfer = parseInt(sharesToTransfer);
    if (isNaN(amountToTransfer) || amountToTransfer <= 0 || amountToTransfer > shares) {
      toast({
        title: "Invalid Amount",
        description: `Please enter a valid amount between 1 and ${shares}`,
        status: "error",
        duration: 3000,
      });
      return;
    }

    setIsTransferring(true);
    setProgress(10);

    try {
      setProgress(30);

      toast({
        title: "Transferring Shares",
        description: "Submitting transaction to blockchain...",
        status: "info",
        duration: 2000,
      });

      setProgress(50);

      // Call smart contract using propertyContractService with signer
      const result = await propertyContractService.transferShares(
        parseInt(investmentId),
        recipientAddress,
        amountToTransfer,
        signer
      );

      setProgress(90);

      if (result.success) {
        toast({
          title: "Transfer Successful!",
          description: `${amountToTransfer} shares transferred successfully!`,
          status: "success",
          duration: 5000,
        });

        setProgress(100);

        // Reset and close
        setTimeout(() => {
          setRecipientAddress("");
          setProgress(0);
          onClose();
        }, 1500);
      } else {
        throw new Error(result.error || "Transaction failed");
      }
    } catch (error) {
      console.error("Error transferring shares:", error);
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
      });
      setProgress(0);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(15px)" />
      <ModalContent
        bg="#1A1F2E"
        color="white"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="whiteAlpha.200"
        overflow="hidden"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      >
        <ModalHeader
          borderBottomWidth="1px"
          borderColor="whiteAlpha.100"
          py={6}
          bgGradient="linear(to-br, rgba(139, 92, 246, 0.1), transparent)"
        >
          <VStack align="start" spacing={1}>
            <Text fontSize="2xl" fontWeight="800" letterSpacing="-0.02em">
              Transfer Shares
            </Text>
            <Text
              fontSize="lg"
              fontWeight="700"
              color="purple.300"
              fontFamily="Outfit"
            >
              {propertyName}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton
          top={6}
          right={6}
          _hover={{
            bg: "whiteAlpha.200",
            transform: "rotate(90deg)",
          }}
          transition="all 0.2s"
        />

        <ModalBody py={8}>
          <VStack spacing={8} align="stretch">
            {isTransferring && (
              <Box>
                <Progress
                  value={progress}
                  size="xs"
                  colorScheme="purple"
                  borderRadius="full"
                  bg="whiteAlpha.100"
                />
                <Text fontSize="xs" color="whiteAlpha.600" mt={2} textAlign="center">
                  Processing transaction...
                </Text>
              </Box>
            )}

            <Box
              p={6}
              bg="whiteAlpha.50"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="whiteAlpha.100"
            >
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.800" fontSize="xs" fontWeight="700" textTransform="uppercase">
                    Amount to Transfer
                  </FormLabel>
                  <HStack spacing={4}>
                    <Input
                      type="number"
                      value={sharesToTransfer}
                      onChange={(e) => setSharesToTransfer(e.target.value)}
                      max={shares}
                      min={1}
                      bg="blackAlpha.300"
                      borderColor="whiteAlpha.200"
                      borderRadius="lg"
                      h="48px"
                      fontSize="lg"
                      fontWeight="800"
                      color="purple.300"
                      _focus={{ borderColor: "purple.500" }}
                    />
                    <VStack align="end" spacing={0} minW="100px">
                      <Text fontSize="xs" color="whiteAlpha.600" fontWeight="600">
                        MAX AVAILABLE
                      </Text>
                      <Text fontSize="md" fontWeight="800" color="white">
                        {shares} Shares
                      </Text>
                    </VStack>
                  </HStack>
                </FormControl>

                <HStack justify="space-between" pt={2} borderTop="1px dashed" borderColor="whiteAlpha.100">
                  <Text fontSize="xs" color="whiteAlpha.600" fontWeight="600">
                    PROPERTY ID
                  </Text>
                  <Text fontSize="xs" fontFamily="mono" color="whiteAlpha.800">
                    #{investmentId}
                  </Text>
                </HStack>
              </VStack>
            </Box>

            <FormControl isRequired>
              <FormLabel color="whiteAlpha.900" fontWeight="700" mb={3} fontSize="sm">
                Recipient Address
              </FormLabel>
              <Input
                placeholder="0x..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                bg="blackAlpha.400"
                borderWidth="1px"
                borderColor="whiteAlpha.200"
                _hover={{ borderColor: "purple.400" }}
                _focus={{
                  borderColor: "purple.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
                }}
                h="56px"
                borderRadius="xl"
                fontFamily="mono"
                fontSize="sm"
                _placeholder={{ color: "whiteAlpha.300" }}
              />
              <Text fontSize="xs" color="whiteAlpha.500" mt={3} fontWeight="500">
                Enter the wallet address of the recipient on Mantle Network
              </Text>
            </FormControl>

            <Alert
              status="warning"
              variant="subtle"
              bg="orange.900"
              color="orange.100"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="orange.700"
              py={4}
            >
              <AlertIcon color="orange.100" />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="800">
                  This action cannot be undone
                </Text>
                <Text fontSize="xs" color="whiteAlpha.800" fontWeight="500">
                  Once transferred, you will no longer own these fractional shares. Make sure the address is correct.
                </Text>
              </VStack>
            </Alert>
          </VStack>
        </ModalBody>

        <ModalFooter bg="blackAlpha.300" borderTopWidth="1px" borderColor="whiteAlpha.100" py={6} px={8}>
          <HStack spacing={4} width="full">
            <Button
              variant="ghost"
              onClick={onClose}
              flex={1}
              h="56px"
              borderRadius="xl"
              _hover={{ bg: "whiteAlpha.100" }}
              isDisabled={isTransferring}
              fontSize="md"
              fontWeight="700"
              color="whiteAlpha.700"
            >
              Cancel
            </Button>
            <Button
              bgGradient="linear(to-r, purple.600, blue.600)"
              color="white"
              _hover={{
                bgGradient: "linear(to-r, purple.500, blue.500)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
              }}
              _active={{ transform: "translateY(0)" }}
              onClick={handleTransfer}
              flex={2}
              h="56px"
              borderRadius="xl"
              isLoading={isTransferring}
              loadingText="Processing Transfer..."
              fontSize="md"
              fontWeight="800"
              transition="all 0.2s"
            >
              Transfer Shares
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
