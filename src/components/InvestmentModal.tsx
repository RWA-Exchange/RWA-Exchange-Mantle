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
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Progress,
  useToast,
  Divider,
  Box,
  Badge,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { propertyContractService } from "@/services/propertyContract";

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
  pricePerShare: number;
  availableShares: number;
  totalShares: number;
  onSuccess?: () => void;
}

export function InvestmentModal({
  isOpen,
  onClose,
  propertyId,
  propertyName,
  pricePerShare,
  availableShares,
  totalShares,
  onSuccess,
}: InvestmentModalProps) {
  const { isConnected, address } = useAccount();
  const signer = useEthersSigner();
  const toast = useToast();
  const [sharesToBuy, setSharesToBuy] = useState(1);
  const [isInvesting, setIsInvesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const totalCost = sharesToBuy * pricePerShare;

  const handleInvest = async () => {
    // Validation checks
    if (!isConnected || !address || !signer) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to continue with the investment.",
        status: "error",
        duration: 4000,
      });
      return;
    }

    if (sharesToBuy <= 0 || sharesToBuy > availableShares) {
      toast({
        title: "Invalid Amount",
        description: `Please enter between 1 and ${availableShares} shares.`,
        status: "error",
        duration: 4000,
      });
      return;
    }

    setIsInvesting(true);
    setProgress(10);
    setStatusMessage("Preparing investment...");

    try {
      // Step 1: Preparing transaction
      setProgress(20);
      setStatusMessage("Please approve the transaction in your wallet...");

      // Step 2: Waiting for user to sign
      toast({
        title: "Sign Transaction",
        description: "Please approve the investment in your wallet",
        status: "info",
        duration: 3000,
      });

      setProgress(40);

      // Call smart contract using Ethers service
      const result = await propertyContractService.invest(
        parseInt(propertyId),
        sharesToBuy,
        pricePerShare.toString(),
        signer
      );

      // Step 3: Processing on blockchain
      setProgress(70);
      setStatusMessage("Processing on blockchain...");

      if (result.success) {
        // Step 4: Success!
        setProgress(100);
        setStatusMessage("Investment successful!");

        const txHash = result.transactionHash;
        const explorerUrl = `https://sepolia.mantlescan.xyz/tx/${txHash}`;

        // Show detailed success toast with transaction info
        toast({
          title: "Investment Successful! 🎉",
          description: (
            <VStack align="start" spacing={2} w="full">
              <Text>You purchased {sharesToBuy} shares for {totalCost} MNT!</Text>
              <Box
                p={2}
                bg="gray.100"
                borderRadius="md"
                w="full"
                fontSize="xs"
                fontFamily="mono"
              >
                <Text fontWeight="bold" mb={1}>Transaction Hash:</Text>
                <Text noOfLines={1}>{txHash}</Text>
              </Box>
              <HStack spacing={2} w="full">
                <Button
                  size="sm"
                  colorScheme="green"
                  variant="outline"
                  flex={1}
                  onClick={() => {
                    navigator.clipboard.writeText(txHash || '');
                    toast({
                      title: "Copied!",
                      description: "Transaction hash copied to clipboard",
                      status: "success",
                      duration: 2000,
                    });
                  }}
                >
                  📋 Copy Hash
                </Button>
                <Button
                  as="a"
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  colorScheme="green"
                  flex={1}
                >
                  🔍 View on Explorer
                </Button>
              </HStack>
            </VStack>
          ),
          status: "success",
          duration: 15000,
          isClosable: true,
        });

        // Call onSuccess callback to refresh property data
        if (onSuccess) {
          onSuccess();
        }

        // Reset and close after delay
        setTimeout(() => {
          setSharesToBuy(1);
          setProgress(0);
          setStatusMessage("");
          onClose();
        }, 2000);
      } else {
        throw new Error(result.error || "Transaction failed");
      }
    } catch (error: any) {
      setProgress(0);
      setStatusMessage("");

      // Parse error and show appropriate message
      const errorMessage = error?.message || error?.toString() || 'Unknown error';

      // Handle specific error types with user-friendly messages
      if (errorMessage.includes('User rejected') ||
        errorMessage.includes('cancelled') ||
        errorMessage.includes('denied')) {
        toast({
          title: "Transaction Cancelled",
          description: "You cancelled the investment transaction. No funds were transferred.",
          status: "warning",
          duration: 5000,
        });
      } else if (errorMessage.includes('insufficient') && errorMessage.includes('fund')) {
        toast({
          title: "Insufficient Funds",
          description: `You need ${totalCost} MNT to complete this investment. Please add funds to your wallet.`,
          status: "error",
          duration: 5000,
        });
      } else if (errorMessage.includes('network') ||
        errorMessage.includes('connection') ||
        errorMessage.includes('timeout')) {
        toast({
          title: "Network Error",
          description: "Unable to connect to the blockchain. Please check your connection and try again.",
          status: "error",
          duration: 5000,
        });
      } else {
        toast({
          title: "Investment Failed",
          description: "Transaction failed. Please try again or contact support if the issue persists.",
          status: "error",
          duration: 5000,
        });
      }
    } finally {
      setIsInvesting(false);
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
      <ModalOverlay
        bg="blackAlpha.800"
        backdropFilter="blur(12px)"
      />
      <ModalContent
        bg="white"
        color="gray.800"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      >
        <ModalHeader
          borderBottomWidth="1px"
          borderColor="gray.100"
          bg="linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)"
          py={6}
        >
          <VStack align="start" spacing={2}>
            <Text
              fontSize="2xl"
              fontWeight="800"
              color="gray.800"
              letterSpacing="-0.02em"
            >
              Invest in Property
            </Text>
            <Text
              fontSize="lg"
              fontWeight="600"
              bgGradient="linear(to-r, purple.600, blue.500)"
              bgClip="text"
            >
              {propertyName}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton
          size="lg"
          _hover={{
            bg: "gray.100",
            transform: "rotate(90deg)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
          transition="all 0.2s"
        />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {isInvesting && (
              <Box>
                <Progress value={progress} size="sm" colorScheme="purple" borderRadius="full" />
                <Text fontSize="sm" color="gray.600" mt={2} textAlign="center">
                  {statusMessage}
                </Text>
              </Box>
            )}

            <Box
              p={5}
              bgGradient="linear(135deg, purple.50 0%, blue.50 100%)"
              borderRadius="xl"
              borderWidth="2px"
              borderColor="purple.100"
            >
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="sm" fontWeight="600" color="gray.600" letterSpacing="wide">
                    PRICE PER SHARE
                  </Text>
                  <Text
                    fontWeight="800"
                    fontSize="2xl"
                    bgGradient="linear(to-r, purple.600, blue.500)"
                    bgClip="text"
                  >
                    {pricePerShare.toLocaleString()} MNT
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" fontWeight="600" color="gray.600" letterSpacing="wide">
                    AVAILABLE SHARES
                  </Text>
                  <VStack align="end" spacing={1}>
                    <Text fontWeight="800" fontSize="2xl" color="green.500">
                      {availableShares.toLocaleString()} / {totalShares.toLocaleString()}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </Box>

            <FormControl isRequired>
              <FormLabel
                fontWeight="700"
                color="gray.800"
                fontSize="md"
                mb={3}
              >
                Number of Shares to Buy
              </FormLabel>
              <NumberInput
                value={isNaN(sharesToBuy) ? 1 : sharesToBuy}
                onChange={(_, val) => setSharesToBuy(isNaN(val) ? 1 : Math.round(val))}
                min={1}
                max={availableShares}
                size="lg"

              >
                <NumberInputField
                  bg="white"
                  borderWidth="2px"
                  borderColor="gray.200"
                  borderRadius="xl"
                  fontSize="xl"
                  fontWeight="600"
                  _hover={{ borderColor: "purple.400" }}
                  _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 4px rgba(139, 92, 246, 0.15)" }}
                />
              </NumberInput>
              <HStack mt={3} spacing={2}>
                <Text fontSize="xs" color="gray.500" fontWeight="500">
                  Min: 1
                </Text>
                <Text fontSize="xs" color="gray.400">•</Text>
                <Text fontSize="xs" color="gray.500" fontWeight="500">
                  Max: {availableShares.toLocaleString()} shares
                </Text>
              </HStack>
            </FormControl>

            <Divider />

            <Box p={5} bg="gray.100" borderRadius="lg" borderWidth="2px" borderColor="gray.300">
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="md" fontWeight="medium" color="gray.700">Shares:</Text>
                  <Text fontWeight="bold" fontSize="md" color="gray.900">{sharesToBuy.toLocaleString()}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="md" fontWeight="medium" color="gray.700">Price per Share:</Text>
                  <Text fontWeight="bold" fontSize="md" color="gray.900">{pricePerShare.toLocaleString()} MNT</Text>
                </HStack>
                <Divider borderColor="gray.400" />
                <HStack justify="space-between">
                  <Text fontWeight="bold" fontSize="xl" color="gray.800">Total Cost:</Text>
                  <Text fontWeight="bold" fontSize="2xl" color="purple.600">
                    {totalCost.toLocaleString()} MNT
                  </Text>
                </HStack>
              </VStack>
            </Box>

            <Alert status="info" borderRadius="md" bg="blue.50" borderWidth="1px" borderColor="blue.200">
              <AlertIcon color="blue.500" />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                  Transaction Fee: ~0.05 MNT
                </Text>
                <Text fontSize="xs" color="gray.700">
                  You will receive an Investment NFT representing your {sharesToBuy} share{sharesToBuy > 1 ? 's' : ''}
                </Text>
              </VStack>
            </Alert>
          </VStack>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderColor="gray.200" bg="gray.50">
          <HStack spacing={3} width="full">
            <Button
              variant="outline"
              onClick={onClose}
              flex={1}
              isDisabled={isInvesting}
              size="lg"
              borderColor="gray.300"
              color="gray.700"
              _hover={{ bg: "gray.100" }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleInvest}
              flex={1}
              isLoading={isInvesting}
              loadingText="Investing..."
              size="lg"
              fontWeight="bold"
              _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
              transition="all 0.2s"
            >
              Invest {totalCost.toLocaleString()} MNT
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}