"use client";

import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  SimpleGrid,
  useColorModeValue,
  useDisclosure,
  Icon,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Flex,
  useToast,
  Tooltip,
  IconButton,
  Image,
  Badge,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { WalletGuard } from "@/components/WalletGuard";
import { TransferSharesModal } from "@/components/TransferSharesModal";
import { 
  FaExchangeAlt, 
  FaChartLine, 
  FaCoins,
  FaWallet,
  FaShareAlt,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";
import { useDappKit } from "@/hooks/useDappKit";
import { propertyContractService } from "@/services/propertyContract";
import { logger } from "@/utils/secureLogger";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function MyInvestmentsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const { account } = useDappKit();
  const toast = useToast();

  const gradient = useColorModeValue(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #1a0b2e 0%, #080420 100%)"
  );
  const glassBg = useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(26, 32, 44, 0.9)");

  // Fetch real investments from blockchain
  const fetchInvestments = async (showRefreshToast = false) => {
    if (!account?.address) {
      setIsLoading(false);
      return;
    }

    if (showRefreshToast) setRefreshing(true);
    else setIsLoading(true);

    try {
      logger.investment('Fetching user investments', { userAddress: account.address });
      const userInvestments = await propertyContractService.getUserInvestments(account.address);
      logger.investment('Successfully fetched investments', { count: userInvestments.length });
      
      // Use secure logging to avoid exposing sensitive data
      
      setInvestments(userInvestments);
      
      if (showRefreshToast) {
        toast({
          title: "Portfolio Updated! 📊",
          description: `Found ${userInvestments.length} investments`,
          status: "success",
          duration: 3000,
        });
      }
    } catch (error) {
      logger.error('Error fetching user investments', error);
      setInvestments([]);
      
      if (showRefreshToast) {
        toast({
          title: "Update Failed",
          description: "Could not refresh portfolio data",
          status: "error",
          duration: 3000,
        });
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [account?.address]);

  // Calculate portfolio metrics with proper data validation
  const totalInvested = investments.reduce((sum, inv) => {
    const amount = Number(inv.investmentAmount) || 0;
    return sum + amount;
  }, 0);
  
  const totalShares = investments.reduce((sum, inv) => {
    const shares = Number(inv.shares) || 0;
    return sum + shares;
  }, 0);
  
  const uniqueProperties = new Set(investments.map(inv => inv.propertyId)).size;
  const averageInvestment = investments.length > 0 ? totalInvested / investments.length : 0;
  
  // Calculate portfolio value - use simple investment amount to match dashboard
  const estimatedValue = investments.reduce((sum, inv) => {
    // Use the actual investment amount in OCT (already converted from MIST)
    const amount = Number(inv.investmentAmount) || 0;
    return sum + amount;
  }, 0);
  
  const portfolioGrowth = totalInvested > 0 ? ((estimatedValue - totalInvested) / totalInvested) * 100 : 0;

  const handleTransferClick = (investment: any) => {
    setSelectedInvestment(investment);
    onOpen();
  };

  return (
    <WalletGuard requireWallet={true}>
      <Box
        bg={gradient}
        minH="100vh"
        py={{ base: 8, md: 12 }}
        position="relative"
        overflow="hidden"
      >
        {/* Animated Background Orbs */}
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
          <VStack spacing={8} align="stretch">
            {/* Header Section */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 } as any}
            >
              <Flex justify="space-between" align="center" mb={6}>
                <VStack align="start" spacing={2}>
                  <HStack spacing={3}>
                    <Icon as={FaWallet} boxSize={8} color="white" />
                    <Heading
                      size="2xl"
                      fontFamily="Outfit"
                      fontWeight="900"
                      color="white"
                      letterSpacing="-0.02em"
                    >
                      Investment Portfolio
                    </Heading>
                  </HStack>
                  <Text
                    fontSize="lg"
                    color="whiteAlpha.900"
                    fontFamily="Inter"
                    fontWeight="500"
                  >
                    Track and manage your real-world asset investments
                  </Text>
                </VStack>
                
                <Tooltip label="Refresh Portfolio" hasArrow>
                  <IconButton
                    aria-label="Refresh portfolio"
                    icon={<FaShareAlt />}
                    colorScheme="whiteAlpha"
                    variant="ghost"
                    size="lg"
                    isLoading={refreshing}
                    onClick={() => fetchInvestments(true)}
                    _hover={{
                      bg: "whiteAlpha.200",
                      transform: "rotate(180deg)",
                      transition: "all 0.3s"
                    }}
                  />
                </Tooltip>
              </Flex>
            </MotionBox>

            {/* Enhanced Portfolio Metrics */}
            <SimpleGrid 
              columns={{ base: 1, sm: 2, lg: 4 }} 
              spacing={6}
            >
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 } as any}
                bg={glassBg}
                backdropFilter="blur(20px)"
                borderRadius="2xl"
                borderWidth="1px"
                borderColor="whiteAlpha.300"
                overflow="hidden"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                <CardBody p={6}>
                  <Stat>
                    <HStack spacing={3} mb={2}>
                      <Icon as={FaCoins} color="purple.500" boxSize={5} />
                      <StatLabel 
                        fontSize="sm" 
                        fontWeight="700" 
                        color="gray.700"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Total Invested
                      </StatLabel>
                    </HStack>
                    <StatNumber 
                      fontSize="3xl" 
                      fontWeight="900"
                      bgGradient="linear(135deg, purple.600 0%, blue.500 100%)"
                      bgClip="text"
                    >
                      {totalInvested.toFixed(2)} OCT
                    </StatNumber>
                    <StatHelpText fontSize="sm" color="gray.600">
                      Across {uniqueProperties} properties
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </MotionCard>

              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 } as any}
                bg={glassBg}
                backdropFilter="blur(20px)"
                borderRadius="2xl"
                borderWidth="1px"
                borderColor="whiteAlpha.300"
                overflow="hidden"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                <CardBody p={6}>
                  <Stat>
                    <HStack spacing={3} mb={2}>
                      <Icon as={FiTrendingUp} color="green.500" boxSize={5} />
                      <StatLabel 
                        fontSize="sm" 
                        fontWeight="700" 
                        color="gray.700"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Portfolio Value
                      </StatLabel>
                    </HStack>
                    <StatNumber 
                      fontSize="3xl" 
                      fontWeight="900"
                      color="green.500"
                    >
                      {estimatedValue.toFixed(2)} OCT
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow type={portfolioGrowth >= 0 ? 'increase' : 'decrease'} />
                      {Math.abs(portfolioGrowth).toFixed(1)}%
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </MotionCard>

              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 } as any}
                bg={glassBg}
                backdropFilter="blur(20px)"
                borderRadius="2xl"
                borderWidth="1px"
                borderColor="whiteAlpha.300"
                overflow="hidden"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                <CardBody p={6}>
                  <Stat>
                    <HStack spacing={3} mb={2}>
                      <Icon as={FaBuilding} color="blue.500" boxSize={5} />
                      <StatLabel 
                        fontSize="sm" 
                        fontWeight="700" 
                        color="gray.700"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Total Shares
                      </StatLabel>
                    </HStack>
                    <StatNumber 
                      fontSize="3xl" 
                      fontWeight="900"
                      color="blue.500"
                    >
                      {totalShares.toLocaleString()}
                    </StatNumber>
                    <StatHelpText fontSize="sm" color="gray.600">
                      {investments.length} investments
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </MotionCard>

              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 } as any}
                bg={glassBg}
                backdropFilter="blur(20px)"
                borderRadius="2xl"
                borderWidth="1px"
                borderColor="whiteAlpha.300"
                overflow="hidden"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                <CardBody p={6}>
                  <Stat>
                    <HStack spacing={3} mb={2}>
                      <Icon as={FaChartLine} color="orange.500" boxSize={5} />
                      <StatLabel 
                        fontSize="sm" 
                        fontWeight="700" 
                        color="gray.700"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Avg Investment
                      </StatLabel>
                    </HStack>
                    <StatNumber 
                      fontSize="3xl" 
                      fontWeight="900"
                      color="orange.500"
                    >
                      {averageInvestment.toFixed(1)} OCT
                    </StatNumber>
                    <StatHelpText fontSize="sm" color="gray.600">
                      Per property
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </MotionCard>
            </SimpleGrid>

            {/* Enhanced Investments List */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 } as any}
            >
              <Flex justify="space-between" align="center" mb={8}>
                <Heading 
                  size="xl" 
                  fontWeight="900"
                  color="white"
                  fontFamily="Outfit"
                >
                  Your Property Portfolio
                </Heading>
                <Badge
                  colorScheme="purple"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  {investments.length} Assets
                </Badge>
              </Flex>

              {isLoading ? (
                <Box 
                  textAlign="center" 
                  py={20}
                  bg={glassBg}
                  backdropFilter="blur(20px)"
                  borderRadius="2xl"
                  borderWidth="1px"
                  borderColor="whiteAlpha.300"
                >
                  <Spinner 
                    size="xl" 
                    color="purple.500"
                    thickness="4px"
                    speed="0.8s"
                  />
                  <Text 
                    mt={6} 
                    color="whiteAlpha.900"
                    fontSize="lg"
                    fontWeight="600"
                  >
                    Loading your investments...
                  </Text>
                </Box>
              ) : investments.length === 0 ? (
                <Box 
                  textAlign="center" 
                  py={20}
                  bg={glassBg}
                  backdropFilter="blur(20px)"
                  borderRadius="2xl"
                  borderWidth="2px"
                  borderColor="whiteAlpha.300"
                  borderStyle="dashed"
                >
                  <Icon as={FaWallet} boxSize={16} color="whiteAlpha.600" mb={4} />
                  <Text 
                    fontSize="2xl" 
                    color="white"
                    fontWeight="700"
                    mb={2}
                  >
                    No investments yet
                  </Text>
                  <Text fontSize="md" color="whiteAlpha.700" fontWeight="500" mb={2}>
                    Your portfolio shows investments in properties, not your wallet balance.
                  </Text>
                  <Text fontSize="sm" color="whiteAlpha.600" fontWeight="400" mb={6}>
                    You have OCT in your wallet - start investing to build your portfolio!
                  </Text>
                  <VStack spacing={3}>
                    <HStack spacing={3}>
                      <Button
                        as="a"
                        href="/collection"
                        bgGradient="linear(to-r, purple.600, blue.600)"
                        color="white"
                        fontWeight="700"
                        size="lg"
                        _hover={{
                          bgGradient: "linear(to-r, purple.500, blue.500)",
                          transform: "translateY(-2px)"
                        }}
                      >
                        Browse Properties
                      </Button>
                      <Button
                        onClick={() => fetchInvestments(true)}
                        colorScheme="purple"
                        variant="outline"
                        size="lg"
                        isLoading={refreshing}
                        _hover={{
                          transform: "translateY(-2px)"
                        }}
                      >
                        🔄 Force Refresh
                      </Button>
                    </HStack>
                    <Text fontSize="xs" color="whiteAlpha.500">
                      💡 Tip: If you just made an investment, try the Force Refresh button
                    </Text>
                  </VStack>
                </Box>
              ) : (
                <SimpleGrid 
                  columns={{ base: 1, lg: 2 }} 
                  spacing={6}
                >
                  {investments.map((investment: any, index: number) => (
                    <MotionCard
                      key={investment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 } as any}
                      bg={glassBg}
                      backdropFilter="blur(20px)"
                      borderRadius="2xl"
                      borderWidth="1px"
                      borderColor="whiteAlpha.300"
                      overflow="hidden"
                      _hover={{ 
                        transform: "translateY(-6px)",
                        boxShadow: "0 20px 40px rgba(102, 126, 234, 0.4)",
                        borderColor: "purple.400",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      }}

                    >
                      {/* Property Image Header */}
                      <Box position="relative" h="200px" overflow="hidden">
                        <Image
                          src={investment.propertyDetails?.imageUrl || "https://via.placeholder.com/400x200?text=Property"}
                          alt={investment.propertyName}
                          w="full"
                          h="full"
                          objectFit="cover"
                          transition="transform 0.4s"
                          _hover={{ transform: "scale(1.05)" }}
                        />
                        <Box
                          position="absolute"
                          bottom={0}
                          left={0}
                          right={0}
                          h="50%"
                          bgGradient="linear(to-t, blackAlpha.800, transparent)"
                        />
                        
                        {/* Property Type Badge */}
                        <Box
                          position="absolute"
                          top={4}
                          left={4}
                          bg="whiteAlpha.900"
                          px={3}
                          py={1}
                          borderRadius="full"
                          backdropFilter="blur(10px)"
                        >
                          <Badge
                            colorScheme="purple"
                            fontSize="xs"
                            fontWeight="700"
                            textTransform="uppercase"
                          >
                            {investment.propertyDetails?.propertyType || "RWA"}
                          </Badge>
                        </Box>

                        {/* Investment Date */}
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
                            <Icon as={FaCalendarAlt} boxSize={3} />
                            <Text fontSize="xs" fontWeight="600">
                              {investment.timestamp ? new Date(investment.timestamp).toLocaleDateString() : "Recent"}
                            </Text>
                          </HStack>
                        </Box>

                        {/* Property Title Overlay */}
                        <Box
                          position="absolute"
                          bottom={4}
                          left={4}
                          right={4}
                        >
                          <Heading
                            size="lg"
                            color="white"
                            fontFamily="Outfit"
                            fontWeight="900"
                            textShadow="0 2px 4px rgba(0,0,0,0.5)"
                            noOfLines={1}
                          >
                            {investment.propertyName}
                          </Heading>
                          {investment.propertyDetails?.location && (
                            <HStack spacing={1} mt={1}>
                              <Icon as={FaMapMarkerAlt} color="whiteAlpha.800" boxSize={3} />
                              <Text
                                fontSize="sm"
                                color="whiteAlpha.800"
                                fontWeight="600"
                                textShadow="0 1px 2px rgba(0,0,0,0.5)"
                              >
                                {investment.propertyDetails.location}
                              </Text>
                            </HStack>
                          )}
                        </Box>
                      </Box>

                      <CardBody p={6}>
                        <VStack align="stretch" spacing={5}>
                          {/* Investment Metrics */}
                          <SimpleGrid columns={2} spacing={4}>
                            <Box
                              p={4}
                              bg="purple.50"
                              _dark={{ bg: "purple.900" }}
                              borderRadius="xl"
                              textAlign="center"
                            >
                              <Text fontSize="xs" color="purple.600" fontWeight="700" mb={1}>
                                YOUR SHARES
                              </Text>
                              <Text fontSize="2xl" fontWeight="900" color="purple.600">
                                {Number(investment.shares || 0).toLocaleString()}
                              </Text>
                              {investment.propertyDetails?.totalShares && (
                                <Text fontSize="xs" color="purple.500" fontWeight="600">
                                  of {Number(investment.propertyDetails.totalShares || 0).toLocaleString()}
                                </Text>
                              )}
                            </Box>

                            <Box
                              p={4}
                              bg="green.50"
                              _dark={{ bg: "green.900" }}
                              borderRadius="xl"
                              textAlign="center"
                            >
                              <Text fontSize="xs" color="green.600" fontWeight="700" mb={1}>
                                INVESTED
                              </Text>
                              <Text fontSize="2xl" fontWeight="900" color="green.600">
                                {Number(investment.investmentAmount || 0).toFixed(2)}
                              </Text>
                              <Text fontSize="xs" color="green.500" fontWeight="600">
                                OCT
                              </Text>
                            </Box>
                          </SimpleGrid>

                          {/* Property Details */}
                          {investment.propertyDetails && (
                            <Box
                              p={4}
                              bg="blue.50"
                              _dark={{ bg: "blue.900" }}
                              borderRadius="xl"
                            >
                              <SimpleGrid columns={2} spacing={3}>
                                <VStack align="start" spacing={1}>
                                  <Text fontSize="xs" color="blue.600" fontWeight="700">
                                    YOUR VALUE
                                  </Text>
                                  <Text fontSize="lg" fontWeight="800" color="blue.600">
                                    {Number(investment.investmentAmount || 0).toFixed(2)} OCT
                                  </Text>
                                </VStack>
                                <VStack align="start" spacing={1}>
                                  <Text fontSize="xs" color="blue.600" fontWeight="700">
                                    SHARE PRICE
                                  </Text>
                                  <Text fontSize="lg" fontWeight="800" color="blue.600">
                                    {Number(investment.propertyDetails.pricePerShare || 0)} OCT
                                  </Text>
                                </VStack>
                              </SimpleGrid>
                              
                              {investment.propertyDetails.rentalYield && (
                                <HStack
                                  mt={3}
                                  p={2}
                                  bg="green.100"
                                  _dark={{ bg: "green.800" }}
                                  borderRadius="lg"
                                  justify="center"
                                >
                                  <Icon as={FiTrendingUp} color="green.600" boxSize={4} />
                                  <Text fontSize="sm" fontWeight="700" color="green.600">
                                    {investment.propertyDetails.rentalYield}% Annual Yield
                                  </Text>
                                </HStack>
                              )}
                            </Box>
                          )}

                          {/* Action Buttons */}
                          <HStack spacing={3}>
                            <Button
                              leftIcon={<FaExchangeAlt />}
                              colorScheme="purple"
                              variant="outline"
                              flex={1}
                              fontWeight="700"
                              borderWidth="2px"
                              onClick={() => handleTransferClick(investment)}
                              _hover={{
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
                              }}
                            >
                              Transfer
                            </Button>
                            <Button
                              leftIcon={<FaChartLine />}
                              bgGradient="linear(to-r, purple.600, blue.600)"
                              color="white"
                              flex={1}
                              fontWeight="700"
                              _hover={{
                                bgGradient: "linear(to-r, purple.500, blue.500)",
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
                              }}
                            >
                              Analytics
                            </Button>
                          </HStack>

                          {/* Investment ID */}
                          <Text 
                            fontSize="xs" 
                            color="gray.500" 
                            fontFamily="mono"
                            textAlign="center"
                            pt={2}
                            borderTop="1px solid"
                            borderColor="gray.200"
                            _dark={{ borderColor: "gray.600" }}
                          >
                            ID: {investment.id.slice(0, 8)}...{investment.id.slice(-8)}
                          </Text>
                        </VStack>
                      </CardBody>
                    </MotionCard>
                  ))}
                </SimpleGrid>
              )}
            </MotionBox>
          </VStack>

          {/* Transfer Modal */}
          {selectedInvestment && (
            <TransferSharesModal
              isOpen={isOpen}
              onClose={onClose}
              investmentId={selectedInvestment.id}
              propertyName={selectedInvestment.propertyName}
              shares={selectedInvestment.shares}
            />
          )}
        </Container>
      </Box>
    </WalletGuard>
  );
}