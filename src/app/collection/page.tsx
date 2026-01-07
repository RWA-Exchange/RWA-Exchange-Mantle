"use client";


import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Icon,
  Image,
  Button,
  Input,
  Select,
  Flex,
  InputGroup,
  InputLeftElement,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { FaArrowRight, FaSearch, FaShoppingCart, FaMapMarkerAlt } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { WalletGuard } from "@/components/WalletGuard";
import { InvestmentModal } from "@/components/InvestmentModal";
import { PropertyDetailsModal } from "@/components/PropertyDetailsModal";
import { useDisclosure } from "@chakra-ui/react";
import { propertyContractService } from "@/services/propertyContract";

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

export default function CollectionPage() {
  // ALL HOOKS MUST BE AT THE TOP - NEVER CONDITIONAL
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [blockchainProperties, setBlockchainProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useBlockchainData, setUseBlockchainData] = useState(false);

  // Chakra UI hooks - FIXED ORDER
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const gradient = useColorModeValue(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #1a0b2e 0%, #080420 100%)"
  );
  const glassBg = useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(26, 32, 44, 0.9)");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching blockchain properties...');
      const { propertyContractService } = await import('@/services/propertyContract');
      const properties = await propertyContractService.getAllProperties();
      console.log('Fetched properties:', properties);

      setBlockchainProperties(properties);
      setUseBlockchainData(true);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setBlockchainProperties([]);
      setUseBlockchainData(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleInvestClick = (item: any) => {
    setSelectedProperty(item);
    onOpen();
  };

  const handleDetailsClick = (item: any) => {
    setSelectedProperty(item);
    onDetailsOpen();
  };

  const dataSource = blockchainProperties;

  const filteredContracts = dataSource.filter(item => {
    const matchesSearch = (item.title || item.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <WalletGuard requireWallet={true}>
      <Box
        bg={gradient}
        minH="100vh"
        py={{ base: 8, md: 12 }}
        position="relative"
        overflow="hidden"
      >
        {/* Animated Orbs */}
        <Box
          position="absolute"
          top="-10%"
          right="-5%"
          w="700px"
          h="700px"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(102,126,234,0.3) 0%, transparent 70%)"
          filter="blur(60px)"
          animation="float 8s ease-in-out infinite"
          sx={{
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-30px)" }
            }
          }}
        />
        <Box
          position="absolute"
          bottom="-10%"
          left="-5%"
          w="600px"
          h="600px"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(118,75,162,0.3) 0%, transparent 70%)"
          filter="blur(60px)"
          animation="float 10s ease-in-out infinite reverse"
        />

        <Container maxW="7xl" position="relative" zIndex={1}>
          {/* Compact Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={3} mb={8} textAlign="center">
              <Heading
                size="xl"
                fontFamily="Outfit"
                fontWeight="900"
                color="white"
              >
                Premium Asset Marketplace
              </Heading>
              <Text
                fontSize="md"
                color="whiteAlpha.900"
                maxW="2xl"
                fontFamily="Inter"
              >
                Discover and invest in tokenized real-world assets on Mantle
              </Text>
            </VStack>
          </MotionBox>

          {/* Improved Search Bar */}
          <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Box
              mb={6}
              p={4}
              bg={glassBg}
              backdropFilter="blur(20px)"
              rounded="2xl"
              boxShadow="0 10px 30px rgba(102, 126, 234, 0.2)"
              borderWidth="1px"
              borderColor="whiteAlpha.300"
            >
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={4}
                align={{ base: "stretch", md: "center" }}
              >
                <InputGroup maxW={{ base: "full", md: "350px" }}>
                  <InputLeftElement h="full">
                    <Icon as={FaSearch} color="purple.500" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bg="white"
                    color="gray.800"
                    border="2px solid"
                    borderColor="gray.300"
                    rounded="full"
                    h="48px"
                    pl={10}
                    fontWeight="500"
                    _placeholder={{ color: "gray.500" }}
                    _hover={{ borderColor: "purple.400", bg: "white" }}
                    _focus={{
                      borderColor: "purple.500",
                      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.15)",
                      bg: "white"
                    }}
                    _dark={{
                      bg: "gray.700",
                      color: "white",
                      borderColor: "gray.600",
                      _placeholder: { color: "gray.400" }
                    }}
                  />
                </InputGroup>

                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  bg="white"
                  color="gray.800"
                  border="2px solid"
                  borderColor="gray.300"
                  rounded="xl"
                  w={{ base: "full", md: "200px" }}
                  h="48px"
                  fontWeight="600"
                  _hover={{ borderColor: "purple.400", bg: "white" }}
                  _focus={{ borderColor: "purple.500", bg: "white" }}
                  _dark={{
                    bg: "gray.700",
                    color: "white",
                    borderColor: "gray.600"
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="ERC721">Unique Assets</option>
                  <option value="ERC1155">Fractional Assets</option>
                </Select>
              </Flex>
            </Box>
          </MotionBox>

          {/* Results Count */}
          <HStack justify="space-between" mb={6}>
            <Text color="whiteAlpha.900" fontWeight="600">
              {filteredContracts.length} {filteredContracts.length === 1 ? 'Asset' : 'Assets'}
            </Text>
            <Badge
              colorScheme={useBlockchainData ? "green" : "gray"}
              px={3}
              py={1}
              borderRadius="full"
              fontWeight="700"
            >
              {isLoading ? "Loading..." : "🔗 Live Data"}
            </Badge>
          </HStack>

          {/* 4 Column Grid - Narrower Cards, Taller Images */}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
            {filteredContracts.map((item, index) => (
              <MotionCard
                key={item.id || item.address || `property-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 } as any}
                whileHover={{ y: -8, scale: 1.02 }}
                bg={glassBg}
                backdropFilter="blur(20px)"
                rounded="2xl"
                overflow="hidden"
                boxShadow="0 8px 30px rgba(102, 126, 234, 0.2)"
                _hover={{ boxShadow: "0 12px 40px rgba(102, 126, 234, 0.3)" }}
                borderWidth="1px"
                borderColor="whiteAlpha.300"
                cursor="pointer"

              >
                <Box position="relative" overflow="hidden">
                  <Image
                    src={item.thumbnail || item.imageUrl}
                    alt={item.title || item.name}
                    w="full"
                    h="220px"
                    objectFit="cover"
                    fallbackSrc="https://via.placeholder.com/400x220?text=Asset"
                    transition="transform 0.4s"
                    _hover={{ transform: "scale(1.08)" }}
                  />

                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    h="40%"
                    bgGradient="linear(to-t, blackAlpha.800, transparent)"
                  />

                  {/* Property Type Badge */}
                  <Box
                    position="absolute"
                    top={3}
                    left={3}
                    bg="whiteAlpha.900"
                    px={2}
                    py={1}
                    rounded="full"
                    backdropFilter="blur(10px)"
                  >
                    <Badge
                      colorScheme={item.type === "ERC721" ? "blue" : undefined}
                      color={item.type === "ERC721" ? undefined : "black"}
                      fontSize="xs"
                      fontWeight="700"
                    >
                      {item.type === "ERC721" ? "Unique" : "Fractional"}
                    </Badge>
                  </Box>

                  {/* Sold Out Badge */}
                  {(item.availableShares === 0 || item.availableShares === "0") && (
                    <Box
                      position="absolute"
                      top={3}
                      right={3}
                      bg="red.500"
                      color="white"
                      px={3}
                      py={1}
                      rounded="full"
                      backdropFilter="blur(10px)"
                      animation="pulse 2s infinite"
                    >
                      <Badge
                        colorScheme="red"
                        color="white"
                        fontSize="xs"
                        fontWeight="900"
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        SOLD OUT
                      </Badge>
                    </Box>
                  )}
                </Box>

                <CardBody p={4}>
                  <VStack align="start" spacing={2.5}>
                    <Heading
                      size="sm"
                      noOfLines={1}
                      fontFamily="Outfit"
                      fontWeight="800"
                      color={headingColor}
                    >
                      {item.title || item.name}
                    </Heading>

                    {item.location && (
                      <HStack spacing={1.5}>
                        <Icon as={FaMapMarkerAlt} color="purple.500" boxSize={3.5} />
                        <Text fontSize="xs" color={textColor} fontWeight="500">
                          {item.location}
                        </Text>
                      </HStack>
                    )}

                    <Text
                      color={textColor}
                      fontSize="xs"
                      noOfLines={2}
                      lineHeight="1.5"
                    >
                      {item.description || "Premium tokenized asset"}
                    </Text>

                    <HStack justify="space-between" w="full" pt={1}>
                      <VStack align="start" spacing={0.5}>
                        <Text fontSize="xs" color="gray.500" fontWeight="600">
                          Price/Share
                        </Text>
                        <Text fontSize="md" fontWeight="800" color="purple.500" fontFamily="Outfit">
                          {item.pricePerShare || 0} MNT
                        </Text>
                      </VStack>
                      <VStack align="end" spacing={0.5}>
                        <Text fontSize="xs" color="gray.500" fontWeight="600">
                          Available
                        </Text>
                        <Text fontSize="md" fontWeight="800" color="green.500" fontFamily="Outfit">
                          {item.availableShares || 0}/{item.totalShares || 0}
                        </Text>
                      </VStack>
                    </HStack>

                    {item.rentalYield && (
                      <HStack
                        w="full"
                        p={1.5}
                        bg="green.50"
                        _dark={{ bg: "green.900" }}
                        rounded="lg"
                        justify="center"
                      >
                        <Icon as={FiTrendingUp} color="green.600" boxSize={3.5} />
                        <Text fontSize="xs" fontWeight="700" color="green.600">
                          {item.rentalYield}% Yield
                        </Text>
                      </HStack>
                    )}

                    {/* Conditional Buttons - Show SOLD OUT if no shares available */}
                    {item.availableShares === 0 || item.availableShares === "0" ? (
                      <Box
                        w="full"
                        pt={1}
                        textAlign="center"
                      >
                        <Text
                          fontSize="xs"
                          color="red.500"
                          fontWeight="700"
                          mt={2}
                          textTransform="uppercase"
                          letterSpacing="wide"
                        >
                          All Shares Taken
                        </Text>
                      </Box>
                    ) : (
                      <HStack spacing={2} w="full" pt={1}>
                        <Button
                          onClick={() => handleDetailsClick(item)}
                          size="sm"
                          variant="outline"
                          colorScheme="purple"
                          flex={1}
                          fontFamily="Outfit"
                          fontWeight="700"
                          borderWidth="2px"
                          _hover={{ transform: "translateY(-1px)" }}
                        >
                          Details
                        </Button>
                        <Button
                          onClick={() => handleInvestClick(item)}
                          size="sm"
                          bgGradient="linear(to-r, purple.600, blue.600)"
                          color="white"
                          flex={1}
                          fontFamily="Outfit"
                          fontWeight="700"
                          leftIcon={<FaShoppingCart />}
                          _hover={{
                            bgGradient: "linear(to-r, purple.500, blue.500)",
                            transform: "translateY(-1px)"
                          }}
                        >
                          Invest
                        </Button>
                      </HStack>
                    )}
                  </VStack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>

          {/* Empty State */}
          {filteredContracts.length === 0 && (
            <Box
              p={12}
              bg={glassBg}
              backdropFilter="blur(20px)"
              rounded="2xl"
              textAlign="center"
              borderWidth="1px"
              borderColor="whiteAlpha.300"
            >
              <VStack spacing={4}>
                <Heading size="md" color="white">No assets found</Heading>
                <Text color="whiteAlpha.900">Try adjusting your filters</Text>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                  }}
                  bgGradient="linear(to-r, purple.600, blue.600)"
                  color="white"
                  fontWeight="700"
                >
                  Clear Filters
                </Button>
              </VStack>
            </Box>
          )}

          {/* CTA */}
          <Box
            mt={12}
            p={8}
            bg={glassBg}
            backdropFilter="blur(20px)"
            rounded="2xl"
            textAlign="center"
            borderWidth="1px"
            borderColor="whiteAlpha.300"
          >
            <VStack spacing={4}>
              <Heading size="lg" color="white" fontFamily="Outfit">
                Ready to Start Investing?
              </Heading>
              <Text color="whiteAlpha.900" maxW="md">
                Connect your wallet to invest in tokenized real-world assets
              </Text>
              <Button
                as={Link}
                href="/dashboard"
                size="lg"
                bgGradient="linear(to-r, purple.600, blue.600)"
                color="white"
                fontFamily="Outfit"
                fontWeight="700"
                rightIcon={<FaArrowRight />}
                _hover={{
                  bgGradient: "linear(to-r, purple.500, blue.500)",
                  transform: "translateY(-2px)"
                }}
              >
                Go to Dashboard
              </Button>
            </VStack>
          </Box>

          {/* Investment Modal */}
          {selectedProperty && (
            <InvestmentModal
              isOpen={isOpen}
              onClose={onClose}
              propertyId={selectedProperty.id || selectedProperty.address}
              propertyName={selectedProperty.name || selectedProperty.title || "Property"}
              pricePerShare={selectedProperty.pricePerShare || 0}
              availableShares={selectedProperty.availableShares || 0}
              totalShares={selectedProperty.totalShares || 0}
              onSuccess={fetchProperties}
            />
          )}

          {/* Property Details Modal */}
          {selectedProperty && (
            <PropertyDetailsModal
              isOpen={isDetailsOpen}
              onClose={onDetailsClose}
              property={selectedProperty}
              onInvestClick={() => {
                onDetailsClose();
                onOpen();
              }}
            />
          )}
        </Container>
      </Box>
    </WalletGuard>
  );
}