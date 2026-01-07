"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Select,
  NumberInput,
  NumberInputField,
  useToast,
  Heading,
  Text,
  InputGroup,
  InputLeftAddon,
  Progress,
  Image,
  Flex,
  Icon,
  Badge,
  Divider,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { propertyContractService, PropertyData } from "@/services/propertyContract";
import { useRouter } from "next/navigation";
import { FiCheck, FiAlertCircle, FiImage, FiDollarSign, FiHome, FiCheckCircle } from "react-icons/fi";
import { FaTwitter, FaCopy } from "react-icons/fa";

export function CreatePropertyForm() {
  const { isConnected, address } = useAccount();
  const signer = useEthersSigner();
  const toast = useToast();
  const router = useRouter();
  const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transactionHash, setTransactionHash] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const cardBg = useColorModeValue("white", "gray.800");
  const glassBg = useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(26, 32, 44, 0.9)");

  const [formData, setFormData] = useState<PropertyData>({
    name: "",
    description: "",
    imageUrl: "",
    location: "",
    propertyType: "Residential",
    totalValue: 1000000,
    totalShares: 10000,
    pricePerShare: 100,
    rentalYield: "8.5",
  });

  // Auto-calculate price per share (always integer for Move contract)
  useEffect(() => {
    if (formData.totalValue && formData.totalShares && !isNaN(formData.totalValue) && !isNaN(formData.totalShares)) {
      const calculated = formData.totalValue / formData.totalShares;
      // Round to nearest integer since Move contract expects u64
      setFormData(prev => ({ ...prev, pricePerShare: Math.round(calculated) }));
    }
  }, [formData.totalValue, formData.totalShares]);

  // Image preview with validation
  useEffect(() => {
    if (formData.imageUrl && formData.imageUrl.startsWith("http")) {
      setImageLoading(true);
      const img = new window.Image();
      img.onload = () => {
        setImagePreviewUrl(formData.imageUrl);
        setImageLoading(false);
        setValidationErrors(prev => ({ ...prev, imageUrl: "" }));
      };
      img.onerror = () => {
        setImagePreviewUrl("");
        setImageLoading(false);
        setValidationErrors(prev => ({ ...prev, imageUrl: "Invalid image URL" }));
      };
      img.src = formData.imageUrl;
    } else {
      setImagePreviewUrl("");
    }
  }, [formData.imageUrl]);

  // Validation functions
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!formData.name || formData.name.length < 3) errors.name = "Name must be at least 3 characters";
    if (!formData.description || formData.description.length < 20) errors.description = "Description must be at least 20 characters";
    if (!formData.location || formData.location.length < 3) errors.location = "Location is required";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (formData.totalValue < 1000) errors.totalValue = "Minimum value is $1,000";
    if (formData.totalShares < 100) errors.totalShares = "Minimum 100 shares recommended";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    if (!formData.imageUrl) errors.imageUrl = "Image URL is required";
    else if (!formData.imageUrl.startsWith("http")) errors.imageUrl = "Must be a valid URL";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    else if (currentStep === 3) isValid = validateStep3();
    else isValid = true;

    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isConnected || !address || !signer) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    setProgress(10);

    try {
      setProgress(30);

      toast({
        title: "Creating Property NFT",
        description: "Submitting transaction to blockchain...",
        status: "info",
        duration: 2000,
      });

      setProgress(50);

      // Convert all numeric values to integers for Move contract (proper rounding)
      const propertyData: PropertyData = {
        ...formData,
        totalValue: Math.round(Number(formData.totalValue)),
        totalShares: Math.round(Number(formData.totalShares)),
        pricePerShare: Math.round(Number(formData.pricePerShare)),
      };

      const result = await propertyContractService.createProperty(
        propertyData,
        signer
      );

      setProgress(90);

      if (result.success) {
        setTransactionHash(result.transactionHash || "");
        setProgress(100);

        // Show success modal with confetti
        onSuccessOpen();

        // Reset form
        setFormData({
          name: "",
          description: "",
          imageUrl: "",
          location: "",
          propertyType: "Residential",
          totalValue: 1000000,
          totalShares: 10000,
          pricePerShare: 100,
          rentalYield: "8.5",
        });
        setCurrentStep(1);
      } else {
        throw new Error(result.error || "Transaction failed");
      }
    } catch (error) {
      console.error("Error creating property:", error);
      toast({
        title: "Error Creating Property",
        description: error instanceof Error ? error.message : "Unknown error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      status: "success",
      duration: 2000,
    });
  };

  const shareOnTwitter = () => {
    const text = `I just tokenized a property on @MantleRWA! 🏠✨ Check it out on Mantle blockchain.`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <>
      <Box
        bg={glassBg}
        backdropFilter="blur(20px) saturate(180%)"
        borderRadius="3xl"
        p={{ base: 6, md: 10 }}
        boxShadow="0 25px 50px -12px rgba(102, 126, 234, 0.25)"
        borderWidth="1px"
        borderColor="whiteAlpha.300"
      >
        {/* Step Indicator */}
        <Flex justify="space-between" mb={16} gap={0} w="full">
          {[1, 2, 3, 4].map((step) => (
            <Flex key={step} align="center" flex={1}>
              <Flex
                w={{ base: "44px", md: "56px" }}
                h={{ base: "44px", md: "56px" }}
                rounded="full"
                align="center"
                justify="center"
                bg={currentStep >= step ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "gray.200"}
                color={currentStep >= step ? "white" : "gray.500"}
                fontWeight="bold"
                fontSize={{ base: "lg", md: "xl" }}
                transition="all 0.3s"
                boxShadow={currentStep === step ? "0 0 0 4px rgba(102, 126, 234, 0.2)" : "none"}
                _dark={{
                  bg: currentStep >= step ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "gray.700"
                }}
              >
                {currentStep > step ? <Icon as={FiCheck} boxSize={{ base: 5, md: 6 }} /> : step}
              </Flex>
              {step < 4 && (
                <Box
                  flex={1}
                  h="3px"
                  bg={currentStep > step ? "linear-gradient(90deg, #667eea 0%, #764ba2 100%)" : "gray.200"}
                  mx={{ base: 3, md: 6 }}
                  rounded="full"
                  transition="all 0.5s"
                  _dark={{ bg: currentStep > step ? "linear-gradient(90deg, #667eea 0%, #764ba2 100%)" : "gray.700" }}
                />
              )}
            </Flex>
          ))}
        </Flex>

        {/* Progress Bar */}
        {isSubmitting && (
          <Box mb={8}>
            <Progress
              value={progress}
              size="md"
              colorScheme="purple"
              borderRadius="full"
              hasStripe
              isAnimated
            />
            <Text mt={2} fontSize="sm" fontWeight="600" color="purple.600" textAlign="center">
              Creating your property NFT... {progress}%
            </Text>
          </Box>
        )}

        {/* Step 1: Property Details */}
        {currentStep === 1 && (
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="lg" mb={2} fontFamily="Outfit" fontWeight="800">
                Property Details
              </Heading>
              <Text color="gray.600" _dark={{ color: "gray.400" }}>
                Tell us about your property
              </Text>
            </Box>

            <FormControl isRequired isInvalid={!!validationErrors.name}>
              <FormLabel fontWeight="700" fontSize="md">Property Name</FormLabel>
              <Input
                placeholder="e.g., Luxury Downtown Condo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                size="lg"
                borderRadius="xl"
                borderWidth="2px"
                _hover={{ borderColor: "purple.300" }}
                _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)" }}
              />
              <FormErrorMessage>{validationErrors.name}</FormErrorMessage>
              <FormHelperText>{formData.name.length}/100 characters</FormHelperText>
            </FormControl>

            <FormControl isRequired isInvalid={!!validationErrors.description}>
              <FormLabel fontWeight="700" fontSize="md">Description</FormLabel>
              <Textarea
                placeholder="Describe your property in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                borderRadius="xl"
                borderWidth="2px"
                resize="vertical"
                _hover={{ borderColor: "purple.300" }}
                _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)" }}
              />
              <FormErrorMessage>{validationErrors.description}</FormErrorMessage>
              <FormHelperText>{formData.description.length}/500 characters</FormHelperText>
            </FormControl>

            <HStack spacing={4}>
              <FormControl isRequired isInvalid={!!validationErrors.location} flex={1}>
                <FormLabel fontWeight="700" fontSize="md">Location</FormLabel>
                <Input
                  placeholder="e.g., Mumbai, India"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  size="lg"
                  borderRadius="xl"
                  borderWidth="2px"
                  _hover={{ borderColor: "purple.300" }}
                  _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)" }}
                />
                <FormErrorMessage>{validationErrors.location}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired flex={1}>
                <FormLabel fontWeight="700" fontSize="md">Property Type</FormLabel>
                <Select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  size="lg"
                  borderRadius="xl"
                  borderWidth="2px"
                  _hover={{ borderColor: "purple.300" }}
                  _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)" }}
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Land">Land</option>
                </Select>
              </FormControl>
            </HStack>
          </VStack>
        )}

        {/* Step 2: Financial Information */}
        {currentStep === 2 && (
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="lg" mb={2} fontFamily="Outfit" fontWeight="800">
                Financial Information
              </Heading>
              <Text color="gray.600" _dark={{ color: "gray.400" }}>
                Set the value and share structure
              </Text>
            </Box>

            <HStack spacing={4}>
              <FormControl isRequired isInvalid={!!validationErrors.totalValue} flex={1}>
                <FormLabel fontWeight="700" fontSize="md">Total Value (USD)</FormLabel>
                <NumberInput
                  value={isNaN(formData.totalValue) ? 0 : formData.totalValue}
                  onChange={(_, val) => setFormData({ ...formData, totalValue: isNaN(val) ? 0 : val })}
                  min={1000}
                  step={1000}
                >
                  <NumberInputField
                    borderRadius="xl"
                    borderWidth="2px"
                    _hover={{ borderColor: "purple.300" }}
                    _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)" }}
                  />
                </NumberInput>
                <FormErrorMessage>{validationErrors.totalValue}</FormErrorMessage>
                <FormHelperText>Minimum: $1,000</FormHelperText>
              </FormControl>

              <FormControl isRequired isInvalid={!!validationErrors.totalShares} flex={1}>
                <FormLabel fontWeight="700" fontSize="md">Total Shares</FormLabel>
                <NumberInput
                  value={isNaN(formData.totalShares) ? 0 : formData.totalShares}
                  onChange={(_, val) => setFormData({ ...formData, totalShares: isNaN(val) ? 0 : val })}
                  min={100}
                  step={100}
                >
                  <NumberInputField
                    borderRadius="xl"
                    borderWidth="2px"
                    _hover={{ borderColor: "purple.300" }}
                    _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)" }}
                  />
                </NumberInput>
                <FormErrorMessage>{validationErrors.totalShares}</FormErrorMessage>
                <FormHelperText>Minimum: 100 shares</FormHelperText>
              </FormControl>
            </HStack>

            <Box
              p={6}
              bg="purple.50"
              borderRadius="xl"
              borderWidth="2px"
              borderColor="purple.200"
              _dark={{ bg: "purple.900", borderColor: "purple.700" }}
            >
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="700" fontSize="lg">Price Per Share (Auto-calculated)</Text>
                <Badge colorScheme="purple" fontSize="md" px={3} py={1} borderRadius="full">
                  ${formData.pricePerShare.toFixed(2)}
                </Badge>
              </HStack>
              <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                Calculated as: Total Value ÷ Total Shares
              </Text>
            </Box>

            <FormControl>
              <FormLabel fontWeight="700" fontSize="md">Expected Rental Yield (%)</FormLabel>
              <Input
                type="number"
                placeholder="8.5"
                value={formData.rentalYield}
                onChange={(e) => setFormData({ ...formData, rentalYield: e.target.value })}
                size="lg"
                borderRadius="xl"
                borderWidth="2px"
                step="0.1"
                min="0"
                max="50"
                _hover={{ borderColor: "purple.300" }}
                _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)" }}
              />
              <FormHelperText>Optional: Expected annual rental return (%)</FormHelperText>
            </FormControl>
          </VStack>
        )}

        {/* Step 3: Media & Verification */}
        {currentStep === 3 && (
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="lg" mb={2} fontFamily="Outfit" fontWeight="800">
                Property Image
              </Heading>
              <Text color="gray.600" _dark={{ color: "gray.400" }}>
                Add a high-quality image of your property
              </Text>
            </Box>

            <FormControl isRequired isInvalid={!!validationErrors.imageUrl}>
              <FormLabel fontWeight="700" fontSize="md">Image URL</FormLabel>
              <Input
                placeholder="https://example.com/property.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                size="lg"
                borderRadius="xl"
                borderWidth="2px"
                _hover={{ borderColor: "purple.300" }}
                _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)" }}
              />
              <FormErrorMessage>{validationErrors.imageUrl}</FormErrorMessage>
              <FormHelperText>Recommended: 1200x800px or higher</FormHelperText>
            </FormControl>

            {/* Image Preview */}
            <Box
              p={6}
              borderRadius="xl"
              borderWidth="2px"
              borderStyle="dashed"
              borderColor="gray.300"
              bg="gray.50"
              _dark={{ borderColor: "gray.600", bg: "gray.900" }}
              minH="300px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {imageLoading ? (
                <VStack>
                  <Icon as={FiImage} boxSize={12} color="gray.400" />
                  <Text color="gray.500">Loading image...</Text>
                </VStack>
              ) : imagePreviewUrl ? (
                <Image
                  src={imagePreviewUrl}
                  alt="Property preview"
                  maxH="300px"
                  borderRadius="lg"
                  objectFit="cover"
                />
              ) : (
                <VStack>
                  <Icon as={FiImage} boxSize={12} color="gray.400" />
                  <Text color="gray.500">Image preview will appear here</Text>
                </VStack>
              )}
            </Box>
          </VStack>
        )}

        {/* Step 4: Review & Confirm */}
        {currentStep === 4 && (
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="lg" mb={2} fontFamily="Outfit" fontWeight="800">
                Review & Confirm
              </Heading>
              <Text color="gray.600" _dark={{ color: "gray.400" }}>
                Please review your property details before submitting
              </Text>
            </Box>

            <Box
              p={6}
              borderRadius="xl"
              borderWidth="2px"
              borderColor="purple.200"
              bg="purple.50"
              _dark={{ borderColor: "purple.700", bg: "purple.900" }}
            >
              {imagePreviewUrl && (
                <Image
                  src={imagePreviewUrl}
                  alt={formData.name}
                  w="full"
                  h="200px"
                  objectFit="cover"
                  borderRadius="lg"
                  mb={4}
                />
              )}

              <VStack align="start" spacing={3}>
                <Heading size="md" fontFamily="Outfit">{formData.name}</Heading>
                <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                  {formData.description}
                </Text>

                <Divider />

                <HStack justify="space-between" w="full">
                  <Text fontWeight="600">Location:</Text>
                  <Text>{formData.location}</Text>
                </HStack>

                <HStack justify="space-between" w="full">
                  <Text fontWeight="600">Type:</Text>
                  <Badge colorScheme="purple">{formData.propertyType}</Badge>
                </HStack>

                <Divider />

                <HStack justify="space-between" w="full">
                  <Text fontWeight="600">Total Value:</Text>
                  <Text fontSize="lg" fontWeight="700">${formData.totalValue.toLocaleString()}</Text>
                </HStack>

                <HStack justify="space-between" w="full">
                  <Text fontWeight="600">Total Shares:</Text>
                  <Text fontSize="lg" fontWeight="700">{formData.totalShares.toLocaleString()}</Text>
                </HStack>

                <HStack justify="space-between" w="full">
                  <Text fontWeight="600">Price Per Share:</Text>
                  <Text fontSize="lg" fontWeight="700" color="purple.600">${formData.pricePerShare.toFixed(2)}</Text>
                </HStack>

                <HStack justify="space-between" w="full">
                  <Text fontWeight="600">Rental Yield:</Text>
                  <Text fontSize="lg" fontWeight="700" color="green.600">{formData.rentalYield}%</Text>
                </HStack>
              </VStack>
            </Box>

            <Box
              p={4}
              bg="blue.50"
              borderRadius="lg"
              borderLeftWidth="4px"
              borderLeftColor="blue.500"
              _dark={{ bg: "blue.900" }}
            >
              <HStack>
                <Icon as={FiAlertCircle} color="blue.500" />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" fontWeight="600">Transaction Fee: ~0.05 MNT</Text>
                  <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>
                    Your property will be minted as an NFT on Mantle
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </VStack>
        )}

        {/* Navigation Buttons */}
        <HStack spacing={4} mt={8}>
          {currentStep > 1 && (
            <Button
              onClick={handleBack}
              size="lg"
              variant="outline"
              colorScheme="purple"
              flex={1}
              h="56px"
              borderRadius="xl"
              fontWeight="700"
              isDisabled={isSubmitting}
            >
              Back
            </Button>
          )}

          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              size="lg"
              bgGradient="linear(to-r, purple.600, blue.600)"
              color="white"
              flex={1}
              h="56px"
              borderRadius="xl"
              fontWeight="700"
              _hover={{
                bgGradient: "linear(to-r, purple.500, blue.500)",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
              }}
              transition="all 0.3s"
            >
              Next Step
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              size="lg"
              bgGradient="linear(to-r, purple.600, blue.600)"
              color="white"
              flex={1}
              h="56px"
              borderRadius="xl"
              fontWeight="700"
              isLoading={isSubmitting}
              loadingText="Creating NFT..."
              _hover={{
                bgGradient: "linear(to-r, purple.500, blue.500)",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
              }}
              transition="all 0.3s"
            >
              🚀 Create Property NFT
            </Button>
          )}
        </HStack>
      </Box>

      {/* Success Modal */}
      <Modal isOpen={isSuccessOpen} onClose={onSuccessClose} isCentered size="lg">
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(20px)" />
        <ModalContent
          borderRadius="3xl"
          overflow="hidden"
          bg={glassBg}
          backdropFilter="blur(20px)"
          borderWidth="1px"
          borderColor="whiteAlpha.300"
        >
          <Box
            bgGradient="linear(to-br, purple.600, blue.600)"
            py={10}
            position="relative"
            overflow="hidden"
          >
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

            <ModalHeader position="relative">
              <VStack spacing={4}>
                <Box
                  p={4}
                  bg="whiteAlpha.200"
                  borderRadius="full"
                  backdropFilter="blur(10px)"
                >
                  <Icon as={FiCheckCircle} boxSize={12} color="white" />
                </Box>
                <Text fontSize="2xl" fontWeight="900" color="white" fontFamily="Outfit">
                  Property Created Successfully! 🎉
                </Text>
              </VStack>
            </ModalHeader>
          </Box>

          <ModalBody py={8} px={8}>
            <VStack spacing={5}>
              <Text textAlign="center" fontSize="md" color="gray.600" _dark={{ color: "gray.400" }}>
                Your property NFT has been minted on Mantle blockchain!
              </Text>

              {transactionHash && (
                <Box
                  p={4}
                  bg="gray.50"
                  _dark={{ bg: "gray.900" }}
                  borderRadius="lg"
                  w="full"
                >
                  <Text fontSize="xs" fontWeight="600" mb={2}>Transaction Hash:</Text>
                  <Text fontSize="xs" fontFamily="mono" noOfLines={1} color="gray.600">
                    {transactionHash}
                  </Text>
                </Box>
              )}

              <HStack spacing={3} w="full">
                <Button
                  leftIcon={<FaCopy />}
                  onClick={() => copyToClipboard(transactionHash)}
                  variant="outline"
                  colorScheme="purple"
                  flex={1}
                >
                  Copy Hash
                </Button>
                <Button
                  leftIcon={<FaTwitter />}
                  onClick={shareOnTwitter}
                  colorScheme="twitter"
                  flex={1}
                >
                  Share
                </Button>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter bg="gray.50" _dark={{ bg: "gray.900" }} py={6}>
            <VStack spacing={3} w="full">
              <Button
                as="a"
                href={`https://sepolia.mantlescan.xyz/tx/${transactionHash}`}
                target="_blank"
                w="full"
                h="56px"
                bgGradient="linear(to-r, purple.600, blue.600)"
                color="white"
                fontWeight="700"
                borderRadius="xl"
                _hover={{
                  bgGradient: "linear(to-r, purple.500, blue.500)",
                  transform: "translateY(-2px)",
                }}
              >
                View on Explorer
              </Button>
              <Button
                onClick={() => {
                  onSuccessClose();
                  router.push("/collection");
                }}
                variant="ghost"
                w="full"
                fontWeight="600"
              >
                Go to Marketplace
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
