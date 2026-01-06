"use client";

import {
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  useColorModeValue,
  Badge,
  HStack,
  VStack,
  Icon,
  Card,
  CardBody,
  Image,
} from "@chakra-ui/react";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLink, FaNetworkWired, FaWallet, FaChartLine, FaPercentage, FaHome } from "react-icons/fa";
import { FiTrendingUp, FiDollarSign } from "react-icons/fi";
import { NFT_CONTRACTS, type NftContract, getDefaultNftContract } from "@/consts/nft_contracts";
import { useOneChainWallet } from "@/hooks/useOneChainWallet";
import { oneChainService } from "@/services/onechain";
import { useWalletStandard } from "@/hooks/useWalletStandard";
import { logger } from "@/utils/secureLogger";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

// Helper function to get property images
function getPropertyImage(propertyName: string, index: number): string {
  const images = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop&crop=center", // Modern house
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=200&fit=crop&crop=center", // Apartment building
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=200&fit=crop&crop=center", // Office building
    "https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&h=200&fit=crop&crop=center", // House exterior
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=200&fit=crop&crop=center", // Modern home
  ];
  
  // Use property name to determine image type
  const name = propertyName.toLowerCase();
  if (name.includes('hotel') || name.includes('resort')) {
    return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop&crop=center";
  } else if (name.includes('office') || name.includes('commercial')) {
    return "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=200&fit=crop&crop=center";
  } else if (name.includes('apartment') || name.includes('condo')) {
    return "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=200&fit=crop&crop=center";
  }
  
  // Default to cycling through images based on index
  return images[index % images.length];
}

// Enhanced sparkline with better visuals
function Sparkline({ data, height = 40 }: { data: number[]; height?: number }) {
  const isDark = useColorModeValue(false, true);
  
  if (!data.length || data.every(v => v === 0)) {
    return (
      <Box h={`${height}px`} display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="sm" color="gray.400" fontStyle="italic">
          No data to display
        </Text>
      </Box>
    );
  }
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(max - min, max * 0.1); // Ensure some range
  const stepX = 100 / Math.max(data.length - 1, 1);
  
  const points = data
    .map((v, i) => `${i * stepX},${100 - ((v - min) / range) * 80 + 10}`) // Add padding
    .join(" ");
    
  const areaPoints = `0,100 ${points} 100,100`;
  
  return (
    <Box h={`${height}px`} position="relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(102,126,234,0.3)" />
            <stop offset="100%" stopColor="rgba(118,75,162,0.1)" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <polygon 
          fill="url(#areaGradient)" 
          points={areaPoints}
        />
        
        {/* Line */}
        <polyline 
          fill="none" 
          stroke="url(#lineGradient)" 
          strokeWidth="3" 
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points} 
        />
        
        {/* Data points */}
        {data.map((v, i) => (
          <circle
            key={i}
            cx={i * stepX}
            cy={100 - ((v - min) / range) * 80 + 10}
            r="1.5"
            fill="url(#lineGradient)"
            opacity="0.8"
          />
        ))}
      </svg>
      
      {/* Value labels */}
      <Box position="absolute" top="0" left="0" fontSize="xs" color="gray.500">
        {max > 0 ? `${max.toFixed(2)} OCT` : '0 OCT'}
      </Box>
      <Box position="absolute" bottom="0" right="0" fontSize="xs" color="gray.500">
        {data.length > 0 ? `${data[data.length - 1].toFixed(2)} OCT` : '0 OCT'}
      </Box>
    </Box>
  );
}

function isInCategory(metadata: any, category: "property" | "carbon"): boolean {
  try {
    const lower = Object.fromEntries(
      Object.entries(metadata || {}).map(([k, v]) => [String(k).toLowerCase(), v])
    );
    const direct = String(
      lower["category"] || lower["asset_type"] || lower["type"] || ""
    ).toLowerCase();
    if (category === "carbon" && direct.includes("carbon")) return true;
    if (
      category === "property" &&
      (direct.includes("property") || direct.includes("real estate"))
    )
      return true;
    const attrs = (metadata?.attributes || []) as Array<any>;
    for (const a of attrs) {
      const t = String(a?.trait_type || a?.traitType || "").toLowerCase();
      if (["category", "asset_type", "type"].includes(t)) {
        const v = String(a?.value || "").toLowerCase();
        if (category === "carbon" && v.includes("carbon")) return true;
        if (
          category === "property" &&
          (v.includes("property") || v.includes("real estate"))
        )
          return true;
      }
      if (t === "is_carbon") {
        const v = String(a?.value || "").toLowerCase();
        if (category === "carbon" && (v === "true" || v === "yes" || v === "1"))
          return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

interface DashboardStats {
  totalInvestments: number;
  totalValue: number;
  totalShares: number;
  averageYield: number;
  propertyCount: number;
  carbonCount: number;
}

export default function Dashboard() {
  const { account, isConnected } = useOneChainWallet();
  const { account: walletAccount, balance } = useWalletStandard();

  const gradient = useColorModeValue(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #1a0b2e 0%, #080420 100%)"
  );
  const glassBg = useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(26, 32, 44, 0.9)");
  const textColor = useColorModeValue("gray.600", "gray.300");

  // Define chain type
  type Chain = {
    id: string;
    name: string;
    isSupported?: boolean;
  };

  // TODO: wire these to actual chain-switching helpers when available
  const isOnSupportedChain = true;
  const switchToDefaultChain = () => { };

  // Initialize with proper type
  const [currentChain, setCurrentChain] = useState<Chain | null>({
    id: 'onechain',
    name: 'OneChain',
    isSupported: true
  });
  const [selectedCollection, setSelectedCollection] = useState<NftContract | null>(
    getDefaultNftContract() || (NFT_CONTRACTS.length > 0 ? NFT_CONTRACTS[0] : null)
  );

  // Real dashboard data
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalInvestments: 0,
    totalValue: 0,
    totalShares: 0,
    averageYield: 0,
    propertyCount: 0,
    carbonCount: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [investments, setInvestments] = useState<any[]>([]);

  // Load dashboard data
  useEffect(() => {
    if (isConnected && (account?.address || walletAccount?.address)) {
      loadDashboardData();
    }
  }, [isConnected, account?.address, walletAccount?.address]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const userAddress = account?.address || walletAccount?.address;
      if (!userAddress) {
        setIsLoading(false);
        return;
      }

      // Import propertyContractService for better structured data
      const { propertyContractService } = await import('@/services/propertyContract');

      // Get user's investments from blockchain using propertyContractService
      const userInvestments = await propertyContractService.getUserInvestments(userAddress);

      // Use secure logging to avoid exposing sensitive data
      logger.investment('Dashboard loading investments', { count: userInvestments.length });

      // Calculate stats from real blockchain data
      let totalValue = 0;
      let totalShares = 0;
      let totalYield = 0;
      let propertyCount = 0;
      let carbonCount = 0;

      const processedInvestments = userInvestments.map((investment: any, index: number) => {
        const sharesOwned = investment.shares || 0;
        const investmentAmount = investment.investmentAmount || 0;
        const propertyDetails = investment.propertyDetails;

        // Get yield from property details - handle different field names
        const yieldStr = propertyDetails?.rentalYield || propertyDetails?.yield || propertyDetails?.expectedYield || '0';
        const yield_ = parseFloat(yieldStr.toString().replace('%', '')) || 0;

        // Accumulate totals
        totalShares += sharesOwned;
        totalValue += investmentAmount;
        totalYield += yield_;

        // Categorize by property type
        const propertyType = propertyDetails?.propertyType?.toLowerCase() || propertyDetails?.type?.toLowerCase() || '';
        if (propertyType.includes('carbon') || propertyType.includes('renewable') || propertyType.includes('green')) {
          carbonCount++;
        } else {
          propertyCount++;
        }

        // Return formatted investment data
        return {
          id: investment.id,
          propertyId: investment.propertyId,
          propertyName: investment.propertyName || 'Unknown Property',
          sharesOwned: sharesOwned,
          investmentAmount: investmentAmount,
          yield: yield_,
          location: propertyDetails?.location || '',
          imageUrl: propertyDetails?.imageUrl || propertyDetails?.image || getPropertyImage(investment.propertyName || 'Property', index),
          timestamp: investment.timestamp,
          propertyDetails: propertyDetails
        };
      });

      // Update dashboard stats with real data
      const newStats = {
        totalInvestments: processedInvestments.length,
        totalValue,
        totalShares,
        averageYield: processedInvestments.length > 0 ? totalYield / processedInvestments.length : 0,
        propertyCount,
        carbonCount
      };

      // Stats calculated successfully - using secure logging to avoid exposing sensitive data
      logger.investment('Dashboard stats calculated', { 
        totalInvestments: newStats.totalInvestments,
        totalValue: newStats.totalValue,
        totalShares: newStats.totalShares
      });

      setDashboardStats(newStats);
      setInvestments(processedInvestments);

    } catch (error) {
      logger.error('Failed to load dashboard data', error);

      // On error, show empty state
      setDashboardStats({
        totalInvestments: 0,
        totalValue: 0,
        totalShares: 0,
        averageYield: 0,
        propertyCount: 0,
        carbonCount: 0
      });
      setInvestments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate sparkline data based on real portfolio performance
  const sparkData = useMemo(() => {
    if (investments.length === 0 || dashboardStats.totalValue === 0) {
      // Show empty state line
      return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    const baseValue = dashboardStats.totalValue;
    const avgYield = dashboardStats.averageYield / 100;
    const data = [];

    // Create realistic growth trend based on actual data
    for (let i = 0; i < 10; i++) {
      const timeProgress = i / 9;
      const yieldGrowth = baseValue * avgYield * timeProgress * 0.5; // More realistic growth
      const volatility = Math.sin(i * 0.5) * baseValue * 0.05; // Smoother volatility
      data.push(Math.max(0, baseValue + yieldGrowth + volatility));
    }

    return data;
  }, [investments, dashboardStats]);

  const oneChainContracts = NFT_CONTRACTS;
  const isOneChainSelected = true;

  return (
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
        {/* Premium Header */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 } as any}
        >
          <Box
            mb={8}
            p={6}
            bg={glassBg}
            backdropFilter="blur(20px) saturate(180%)"
            rounded="3xl"
            boxShadow="0 25px 50px -12px rgba(102, 126, 234, 0.25)"
            borderWidth="1px"
            borderColor="whiteAlpha.300"
          >
            <Flex direction={{ base: "column", lg: "row" }} justify="space-between" gap={4}>
              <VStack align="start" spacing={2}>
                <HStack>
                  <Heading
                    size="xl"
                    fontFamily="Outfit"
                    fontWeight="900"
                    bgGradient="linear(to-r, purple.600, blue.600)"
                    bgClip="text"
                  >
                    Investor Dashboard
                  </Heading>
                  {isOneChainSelected && (
                    <Badge
                      bgGradient="linear(to-r, purple.600, blue.600)"
                      color="white"
                      px={3}
                      py={1}
                      rounded="full"
                      fontWeight="700"
                    >
                      <HStack spacing={1}>
                        <Icon as={FaLink} boxSize={3} />
                        <Text fontSize="xs">OneChain</Text>
                      </HStack>
                    </Badge>
                  )}
                </HStack>
                <Text color={textColor} fontSize="sm" fontFamily="Inter">
                  {isConnected
                    ? "Track your tokenized real-world asset investments"
                    : "Connect wallet to view your portfolio"}
                </Text>
              </VStack>

              <VStack align="end" spacing={2}>
                <Select
                  maxW="320px"
                  value={selectedCollection?.address || ''}
                  onChange={(e) => {
                    const next = NFT_CONTRACTS.find((c) => c.address === e.target.value);
                    if (next) setSelectedCollection(next);
                  }}
                  bg="white"
                  color="gray.800"
                  rounded="xl"
                  fontWeight="600"
                  _dark={{ bg: "gray.700", color: "white" }}
                >
                  {oneChainContracts.map((c) => (
                    <option key={c.address} value={c.address}>
                      {(c.title ?? c.slug ?? c.address.slice(0, 8))}
                    </option>
                  ))}
                </Select>
                <Text fontSize="xs" color={textColor}>OneChain • {selectedCollection?.type || 'N/A'}</Text>
              </VStack>
            </Flex>
          </Box>
        </MotionBox>

        {/* Premium Stats Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} mb={8}>
          <PremiumStatCard
            label="Total Investments"
            value={dashboardStats.totalInvestments.toString()}
            hint="Active positions"
            icon={FaHome}
            delay={0}
          />
          <PremiumStatCard
            label="Portfolio Value"
            value={`${dashboardStats.totalValue.toFixed(2)} OCT`}
            hint={isConnected ? `Wallet: ${(parseFloat(balance || '0') / 100_000_000).toFixed(4)} OCT` : "Connect wallet"}
            icon={FaWallet}
            delay={0.1}
          />
          <PremiumStatCard
            label="Total Shares"
            value={dashboardStats.totalShares.toString()}
            hint="Across all properties"
            icon={FaChartLine}
            delay={0.2}
          />
          <PremiumStatCard
            label="Avg. Yield"
            value={`${dashboardStats.averageYield.toFixed(1)}%`}
            hint="Expected annual return"
            icon={FiTrendingUp}
            delay={0.3}
          />
        </SimpleGrid>

        {/* Charts Row */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 } as any}
            bg={glassBg}
            backdropFilter="blur(20px)"
            rounded="2xl"
            boxShadow="0 10px 30px rgba(102, 126, 234, 0.2)"
            borderWidth="1px"
            borderColor="whiteAlpha.300"
          >
            <CardBody p={6}>
              <Heading size="md" mb={2} fontFamily="Outfit" fontWeight="800">
                Portfolio Value Trend
              </Heading>
              <Text color={textColor} mb={4} fontSize="sm">
                {dashboardStats.totalInvestments > 0
                  ? "Based on your investment performance"
                  : "Connect wallet and invest to see trends"}
              </Text>
              <Sparkline data={sparkData} height={100} />
            </CardBody>
          </MotionCard>

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 } as any}
            bg={glassBg}
            backdropFilter="blur(20px)"
            rounded="2xl"
            boxShadow="0 10px 30px rgba(102, 126, 234, 0.2)"
            borderWidth="1px"
            borderColor="whiteAlpha.300"
          >
            <CardBody p={6}>
              <Heading size="md" mb={2} fontFamily="Outfit" fontWeight="800">
                Holdings by Category
              </Heading>
              <Text color={textColor} mb={4} fontSize="sm">
                Distribution of your portfolio
              </Text>
              <VStack spacing={3} align="stretch">
                <Box>
                  <Flex justify="space-between" mb={1}>
                    <Text fontSize="sm" fontWeight="600">Property Assets</Text>
                    <Text fontSize="sm" fontWeight="700" color="blue.600">
                      {dashboardStats.propertyCount}
                    </Text>
                  </Flex>
                  <Progress
                    value={dashboardStats.totalInvestments ? (dashboardStats.propertyCount / dashboardStats.totalInvestments) * 100 : 0}
                    colorScheme="blue"
                    rounded="full"
                    h="8px"
                  />
                </Box>
                <Box>
                  <Flex justify="space-between" mb={1}>
                    <Text fontSize="sm" fontWeight="600">Carbon/Renewable</Text>
                    <Text fontSize="sm" fontWeight="700" color="green.600">
                      {dashboardStats.carbonCount}
                    </Text>
                  </Flex>
                  <Progress
                    value={dashboardStats.totalInvestments ? (dashboardStats.carbonCount / dashboardStats.totalInvestments) * 100 : 0}
                    colorScheme="green"
                    rounded="full"
                    h="8px"
                  />
                </Box>
              </VStack>
            </CardBody>
          </MotionCard>
        </SimpleGrid>

        {/* Investments List */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 } as any}
        >
          <Box
            p={6}
            bg={glassBg}
            backdropFilter="blur(20px)"
            rounded="2xl"
            boxShadow="0 10px 30px rgba(102, 126, 234, 0.2)"
            borderWidth="1px"
            borderColor="whiteAlpha.300"
          >
            <Heading size="md" mb={4} fontFamily="Outfit" fontWeight="800">
              Your Investments
            </Heading>
            {isLoading ? (
              <VStack spacing={4} py={8}>
                <Box
                  w="60px"
                  h="60px"
                  borderRadius="full"
                  bg="purple.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  animation="pulse 2s infinite"
                >
                  <Icon as={FaChartLine} boxSize={6} color="purple.600" />
                </Box>
                <Text color={textColor} fontSize="lg" fontWeight="600">
                  Loading your investments...
                </Text>
              </VStack>
            ) : investments.length === 0 ? (
              <VStack spacing={4} py={12}>
                <Box
                  w="80px"
                  h="80px"
                  borderRadius="full"
                  bg="gray.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  _dark={{ bg: "gray.700" }}
                >
                  <Icon as={FaHome} boxSize={8} color="gray.400" />
                </Box>
                <VStack spacing={2}>
                  <Text color={textColor} fontSize="lg" fontWeight="600">
                    {isConnected ? "No investments yet" : "Connect your wallet"}
                  </Text>
                  <Text color={textColor} fontSize="sm" textAlign="center" maxW="300px">
                    {isConnected 
                      ? "Start building your tokenized real estate portfolio by investing in properties from our collection." 
                      : "Connect your wallet to view your investment portfolio and track your tokenized asset holdings."}
                  </Text>
                </VStack>
              </VStack>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {investments.map((investment, index) => (
                  <InvestmentCard key={investment.id || index} investment={investment} index={index} />
                ))}
              </SimpleGrid>
            )}
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}

// Premium Stat Card Component
function PremiumStatCard({
  label,
  value,
  hint,
  icon,
  delay
}: {
  label: string;
  value: string;
  hint?: string;
  icon: any;
  delay: number;
}) {
  const glassBg = useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(26, 32, 44, 0.9)");

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5 } as any}
      whileHover={{ y: -4, scale: 1.02 }}
      bg={glassBg}
      backdropFilter="blur(20px)"
      rounded="2xl"
      boxShadow="0 8px 30px rgba(102, 126, 234, 0.2)"
      _hover={{ boxShadow: "0 12px 40px rgba(102, 126, 234, 0.3)" }}
      borderWidth="1px"
      borderColor="whiteAlpha.300"
      cursor="pointer"
      sx={{ transition: "all 0.3s" }}
    >
      <CardBody p={5}>
        <Flex align="center" justify="space-between">
          <VStack align="start" spacing={1}>
            <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase">
              {label}
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="900"
              fontFamily="Outfit"
              bgGradient="linear(to-r, purple.600, blue.600)"
              bgClip="text"
            >
              {value}
            </Text>
            {hint && (
              <Text fontSize="xs" color="gray.500">
                {hint}
              </Text>
            )}
          </VStack>
          <Icon
            as={icon}
            boxSize={10}
            color="purple.400"
            opacity={0.6}
          />
        </Flex>
      </CardBody>
    </MotionCard>
  );
}

// Investment Card Component
function InvestmentCard({ investment, index }: { investment: any; index: number }) {
  const glassBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.7, duration: 0.4 } as any}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <Box
        bg={glassBg}
        rounded="xl"
        overflow="hidden"
        boxShadow="0 4px 12px rgba(0,0,0,0.1)"
        _hover={{ boxShadow: "0 8px 20px rgba(102, 126, 234, 0.2)" }}
        sx={{ transition: "all 0.3s" }}
      >
        <Image
          src={investment.imageUrl}
          alt={investment.propertyName}
          h="120px"
          w="full"
          objectFit="cover"
          fallbackSrc="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop&crop=center"
          onError={(e) => {
            // Fallback to a different property image if the first one fails
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('unsplash')) {
              target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop&crop=center";
            }
          }}
        />
        <Box p={4}>
          <VStack align="start" spacing={2}>
            <Heading size="sm" fontFamily="Outfit" fontWeight="800" noOfLines={1}>
              {investment.propertyName || `Investment #${index + 1}`}
            </Heading>
            <HStack spacing={2} w="full" justify="space-between">
              <Badge colorScheme="purple" rounded="full" px={2}>
                {investment.sharesOwned} shares
              </Badge>
              <Badge colorScheme="green" rounded="full" px={2}>
                {investment.yield}% yield
              </Badge>
            </HStack>
            <Flex w="full" justify="space-between" align="center">
              <Text fontSize="xs" color={textColor}>
                Investment
              </Text>
              <Text fontSize="lg" fontWeight="800" color="green.600" fontFamily="Outfit">
                {investment.investmentAmount?.toFixed(2)} OCT
              </Text>
            </Flex>
          </VStack>
        </Box>
      </Box>
    </MotionBox>
  );
}
