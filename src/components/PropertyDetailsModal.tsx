"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Image,
  Badge,
  Divider,
  SimpleGrid,
  Box,
  Icon,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
} from "@chakra-ui/react";
import { 
  FaMapMarkerAlt, 
  FaHome, 
  FaCoins, 
  FaChartLine, 
  FaCalendarAlt,
  FaUser,
  FaShieldAlt
} from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
  onInvestClick: () => void;
}

export function PropertyDetailsModal({
  isOpen,
  onClose,
  property,
  onInvestClick
}: PropertyDetailsModalProps) {
  const glassBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (!property) return null;

  const soldPercentage = ((property.totalShares - property.availableShares) / property.totalShares) * 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent
        bg={glassBg}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor={borderColor}
        maxH="90vh"
      >
        <ModalHeader>
          <HStack spacing={3}>
            <Icon as={FaHome} color="purple.500" boxSize={6} />
            <VStack align="start" spacing={0}>
              <Text fontSize="2xl" fontWeight="900" fontFamily="Outfit">
                {property.name || property.title}
              </Text>
              <HStack spacing={2}>
                <Icon as={FaMapMarkerAlt} color="gray.500" boxSize={4} />
                <Text fontSize="sm" color={textColor}>
                  {property.location || "Premium Location"}
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Property Image */}
            <Box borderRadius="xl" overflow="hidden" position="relative">
              <Image
                src={property.imageUrl || property.thumbnail || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop"}
                alt={property.name || property.title}
                w="full"
                h="300px"
                objectFit="cover"
              />
              <Box
                position="absolute"
                top={4}
                right={4}
                bg="blackAlpha.700"
                color="white"
                px={3}
                py={1}
                borderRadius="full"
                backdropFilter="blur(10px)"
              >
                <HStack spacing={1}>
                  <Icon as={FaShieldAlt} boxSize={3} />
                  <Text fontSize="xs" fontWeight="600">
                    Verified Property
                  </Text>
                </HStack>
              </Box>
            </Box>

            {/* Property Type and Status */}
            <HStack spacing={3} justify="space-between">
              <Badge
                colorScheme="purple"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
                fontWeight="700"
              >
                {property.propertyType || property.type || "Real Estate"}
              </Badge>
              <Badge
                colorScheme={property.availableShares > 0 ? "green" : "red"}
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
                fontWeight="700"
              >
                {property.availableShares > 0 ? "Available" : "Sold Out"}
              </Badge>
            </HStack>

            {/* Key Metrics */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Stat textAlign="center" p={4} bg="purple.50" borderRadius="xl" _dark={{ bg: "purple.900" }}>
                <StatLabel fontSize="xs" color="purple.600" fontWeight="700">
                  TOTAL VALUE
                </StatLabel>
                <StatNumber fontSize="lg" fontWeight="900" color="purple.600">
                  ${property.totalValue?.toLocaleString() || "N/A"}
                </StatNumber>
              </Stat>

              <Stat textAlign="center" p={4} bg="blue.50" borderRadius="xl" _dark={{ bg: "blue.900" }}>
                <StatLabel fontSize="xs" color="blue.600" fontWeight="700">
                  PRICE/SHARE
                </StatLabel>
                <StatNumber fontSize="lg" fontWeight="900" color="blue.600">
                  {property.pricePerShare} OCT
                </StatNumber>
              </Stat>

              <Stat textAlign="center" p={4} bg="green.50" borderRadius="xl" _dark={{ bg: "green.900" }}>
                <StatLabel fontSize="xs" color="green.600" fontWeight="700">
                  ANNUAL YIELD
                </StatLabel>
                <StatNumber fontSize="lg" fontWeight="900" color="green.600">
                  {property.rentalYield || "8.5%"}
                </StatNumber>
              </Stat>

              <Stat textAlign="center" p={4} bg="orange.50" borderRadius="xl" _dark={{ bg: "orange.900" }}>
                <StatLabel fontSize="xs" color="orange.600" fontWeight="700">
                  AVAILABLE
                </StatLabel>
                <StatNumber fontSize="lg" fontWeight="900" color="orange.600">
                  {property.availableShares?.toLocaleString() || "0"}
                </StatNumber>
                <StatHelpText fontSize="xs" color="orange.500">
                  of {property.totalShares?.toLocaleString()} shares
                </StatHelpText>
              </Stat>
            </SimpleGrid>

            {/* Investment Progress */}
            <Box p={4} bg="gray.50" borderRadius="xl" _dark={{ bg: "gray.700" }}>
              <VStack spacing={3}>
                <HStack w="full" justify="space-between">
                  <Text fontSize="sm" fontWeight="700" color={textColor}>
                    Investment Progress
                  </Text>
                  <Text fontSize="sm" fontWeight="700" color="purple.600">
                    {soldPercentage.toFixed(1)}% Funded
                  </Text>
                </HStack>
                <Progress
                  value={soldPercentage}
                  colorScheme="purple"
                  size="lg"
                  w="full"
                  borderRadius="full"
                  bg="gray.200"
                  _dark={{ bg: "gray.600" }}
                />
                <HStack w="full" justify="space-between" fontSize="xs" color={textColor}>
                  <Text>{(property.totalShares - property.availableShares)?.toLocaleString()} shares sold</Text>
                  <Text>{property.availableShares?.toLocaleString()} remaining</Text>
                </HStack>
              </VStack>
            </Box>

            {/* Property Description */}
            <Box>
              <Text fontSize="lg" fontWeight="700" mb={3} fontFamily="Outfit">
                Property Description
              </Text>
              <Text color={textColor} lineHeight="1.6">
                {property.description || `${property.name || property.title} is a premium real estate investment opportunity located in ${property.location || "a prime location"}. This property offers excellent rental yield potential and long-term capital appreciation prospects. The property is professionally managed and offers investors a hassle-free way to invest in real estate through fractional ownership.`}
              </Text>
            </Box>

            <Divider />

            {/* Investment Details */}
            <Box>
              <Text fontSize="lg" fontWeight="700" mb={4} fontFamily="Outfit">
                Investment Information
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Icon as={FaCoins} color="purple.500" />
                    <Text fontSize="sm" fontWeight="600">Minimum Investment:</Text>
                    <Text fontSize="sm" color={textColor}>{property.pricePerShare} OCT (1 share)</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaChartLine} color="green.500" />
                    <Text fontSize="sm" fontWeight="600">Expected Returns:</Text>
                    <Text fontSize="sm" color={textColor}>{property.rentalYield || "8.5%"} annually</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaCalendarAlt} color="blue.500" />
                    <Text fontSize="sm" fontWeight="600">Investment Type:</Text>
                    <Text fontSize="sm" color={textColor}>Fractional Ownership</Text>
                  </HStack>
                </VStack>
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Icon as={FaUser} color="orange.500" />
                    <Text fontSize="sm" fontWeight="600">Property Owner:</Text>
                    <Text fontSize="sm" color={textColor} fontFamily="mono">
                      {property.owner ? `${property.owner.slice(0, 6)}...${property.owner.slice(-4)}` : "Verified"}
                    </Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiTrendingUp} color="purple.500" />
                    <Text fontSize="sm" fontWeight="600">Dividend Frequency:</Text>
                    <Text fontSize="sm" color={textColor}>Monthly</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaShieldAlt} color="green.500" />
                    <Text fontSize="sm" fontWeight="600">Security:</Text>
                    <Text fontSize="sm" color={textColor}>Blockchain Verified</Text>
                  </HStack>
                </VStack>
              </SimpleGrid>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3} w="full">
            <Button
              variant="outline"
              colorScheme="gray"
              flex={1}
              onClick={onClose}
              fontWeight="700"
            >
              Close
            </Button>
            <Button
              bgGradient="linear(to-r, purple.600, blue.600)"
              color="white"
              flex={2}
              onClick={() => {
                onClose();
                onInvestClick();
              }}
              fontWeight="700"
              size="lg"
              leftIcon={<Icon as={FaCoins} />}
              isDisabled={property.availableShares <= 0}
              _hover={{
                bgGradient: "linear(to-r, purple.500, blue.500)",
                transform: "translateY(-1px)"
              }}
            >
              {property.availableShares > 0 ? "Invest Now" : "Sold Out"}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
