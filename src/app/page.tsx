"use client";

import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Icon,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FaArrowRight, FaChartLine, FaGlobe, FaShieldAlt, FaLock, FaRocket, FaCoins, FaCheckCircle } from "react-icons/fa";
import { FiAlertCircle, FiTrendingUp, FiUsers, FiZap, FiCheck, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(126, 87, 194, 0.4); }
  50% { box-shadow: 0 0 40px rgba(126, 87, 194, 0.8), 0 0 60px rgba(102, 126, 234, 0.6); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  const handleAssetClick = (e: React.MouseEvent, path: string) => {
    if (!isConnected) {
      e.preventDefault();
      // Redirect to collection page where they can connect wallet
      router.push("/collection");
    } else {
      router.push(path);
    }
  };

  const gradient = useColorModeValue(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #1a0b2e 0%, #080420 100%)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const glowColor = useColorModeValue("purple.500", "purple.400");

  return (
    <Box>
      {/* Enhanced Hero Section with Logo */}
      <Box
        bg={gradient}
        py={{ base: 24, md: 40 }}
        color="white"
        position="relative"
        overflow="hidden"
      >
        {/* Animated Orbs Background */}
        <Box
          position="absolute"
          top="-10%"
          left="-5%"
          w="500px"
          h="500px"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(102,126,234,0.3) 0%, transparent 70%)"
          animation={`${float} 8s ease-in-out infinite`}
          filter="blur(40px)"
        />
        <Box
          position="absolute"
          top="20%"
          right="-10%"
          w="600px"
          h="600px"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(118,75,162,0.25) 0%, transparent 70%)"
          animation={`${float} 10s ease-in-out infinite reverse`}
          filter="blur(60px)"
        />


        {/* Subtle Grid Pattern Overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.05}
          backgroundImage="radial-gradient(circle, white 1px, transparent 1px)"
          backgroundSize="50px 50px"
        />

        <Container maxW="7xl" position="relative" zIndex={1}>

          <VStack spacing={12}>
            {/* Logo Introduction */}
            <MotionBox
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 200 }}
            >
              <VStack spacing={4}>
                <Badge
                  colorScheme="purple"
                  variant="solid"
                  px={6}
                  py={2.5}
                  rounded="full"
                  fontSize="sm"
                  fontFamily="Outfit"
                  fontWeight="600"
                  boxShadow="0 4px 20px rgba(126,87,194,0.3)"
                  textTransform="none"
                >
                  Next-Gen Asset Tokenization Platform
                </Badge>
              </VStack>
            </MotionBox>

            {/* Main Headline */}
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9 }}
              textAlign="center"
            >
              <Heading
                size={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontFamily="Outfit"
                fontWeight="800"
                lineHeight="1.1"
                maxW="5xl"
                mx="auto"
                mb={6}
                textShadow="0 4px 20px rgba(0,0,0,0.2)"
              >
                <Text
                  as="span"
                  display="inline"
                  bgGradient="linear(to-r, white, purple.200)"
                  bgClip="text"
                >
                  Own Fractional Shares of
                </Text>
                <br />
                <Text
                  as="span"
                  display="inline"
                  bgGradient="linear(to-r, cyan.200, purple.100, pink.200)"
                  bgClip="text"
                >
                  Premium Real-World Assets
                </Text>
              </Heading>

              <Text
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                maxW="4xl"
                mx="auto"
                opacity={0.95}
                fontFamily="Inter"
                lineHeight="1.8"
                fontWeight="400"
                color="whiteAlpha.900"
              >
                Invest in tokenized real estate, premium commodities, and exclusive assets.
                Built on Mantle for secure, transparent, and compliant transactions.
              </Text>
            </MotionBox>

            {/* CTA Buttons */}
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.7 }}
            >
              <HStack spacing={6} pt={4} flexWrap="wrap" justify="center">
                <Button
                  as={Link}
                  href="/collection"
                  size="lg"
                  h="60px"
                  px={10}
                  bg="white"
                  color="purple.600"
                  fontFamily="Outfit"
                  fontWeight="700"
                  fontSize="lg"
                  rightIcon={<FaArrowRight />}
                  boxShadow="0 8px 32px rgba(255,255,255,0.2)"
                  _hover={{
                    transform: "translateY(-4px) scale(1.05)",
                    boxShadow: "0 12px 40px rgba(255,255,255,0.3)",
                    bg: "purple.50"
                  }}
                  _active={{
                    transform: "translateY(-2px) scale(1.02)"
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  rounded="xl"
                >
                  Explore Marketplace
                </Button>
                <Button
                  as={Link}
                  href="/create-property"
                  size="lg"
                  h="60px"
                  px={10}
                  variant="outline"
                  borderColor="white"
                  borderWidth="2px"
                  color="white"
                  fontFamily="Outfit"
                  fontWeight="600"
                  fontSize="lg"
                  backdropFilter="blur(10px)"
                  bg="whiteAlpha.100"
                  _hover={{
                    bg: "whiteAlpha.200",
                    transform: "translateY(-4px)",
                    borderColor: "purple.200",
                    boxShadow: "0 12px 40px rgba(126,87,194,0.3)"
                  }}
                  _active={{
                    transform: "translateY(-2px)"
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  rounded="xl"
                >
                  List Your Asset
                </Button>
              </HStack>
            </MotionBox>

            {/* Trust Indicators */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <HStack
                spacing={8}
                pt={8}
                justify="center"
                flexWrap="wrap"
                opacity={0.9}
              >
                <HStack spacing={2}>
                  <Icon as={FaCheckCircle} color="green.300" boxSize={5} />
                  <Text fontSize="sm" fontWeight="500">SEC Compliant</Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={FaShieldAlt} color="blue.300" boxSize={5} />
                  <Text fontSize="sm" fontWeight="500">Blockchain Secured</Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={FaCheckCircle} color="purple.300" boxSize={5} />
                  <Text fontSize="sm" fontWeight="500">Instant Liquidity</Text>
                </HStack>
              </HStack>
            </MotionBox>
          </VStack>

        </Container>
      </Box>

      {/* Premium Features Showcase */}
      <Box py={24} bg={useColorModeValue("gray.50", "gray.900")} position="relative">
        <Container maxW="7xl">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            mb={16}
          >
            <VStack spacing={4} textAlign="center">
              <Heading
                size="2xl"
                fontFamily="Outfit"
                fontWeight="800"
                bgGradient="linear(to-r, purple.600, blue.500)"
                bgClip="text"
              >
                Why Choose MantleRWA?
              </Heading>
              <Text fontSize="xl" color={textColor} maxW="3xl" lineHeight="1.8">
                The most advanced platform for tokenizing and trading real-world assets
                with institutional-grade security and compliance.
              </Text>
            </VStack>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {[
              {
                icon: FiZap,
                label: "Instant Fractionalization",
                desc: "Split assets into tradeable shares in seconds",
                color: "purple",
                gradient: "linear(to-br, purple.400, purple.600)"
              },
              {
                icon: FaShieldAlt,
                label: "Blockchain Secured",
                desc: "Military-grade security on Mantle",
                color: "blue",
                gradient: "linear(to-br, blue.400, blue.600)"
              },
              {
                icon: FiTrendingUp,
                label: "Real-Time Trading",
                desc: "24/7 instant liquidity marketplace",
                color: "green",
                gradient: "linear(to-br, green.400, green.600)"
              },
              {
                icon: FiUsers,
                label: "Global Access",
                desc: "Invest from anywhere in the world",
                color: "orange",
                gradient: "linear(to-br, orange.400, orange.600)"
              }
            ].map((feature, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.7 }}
                viewport={{ once: true }}
              >
                <VStack
                  spacing={5}
                  p={8}
                  bg={cardBg}
                  rounded="2xl"
                  shadow="lg"
                  borderWidth="1px"
                  borderColor={useColorModeValue("gray.100", "gray.700")}
                  h="full"
                  _hover={{
                    transform: "translateY(-8px) scale(1.02)",
                    shadow: "2xl",
                    borderColor: `${feature.color}.400`
                  }}
                  transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  cursor="pointer"
                >
                  <Box
                    p={4}
                    bgGradient={feature.gradient}
                    rounded="xl"
                    boxShadow="lg"
                  >
                    <Icon as={feature.icon} w={8} h={8} color="white" />
                  </Box>
                  <VStack spacing={3} textAlign="center">
                    <Text
                      fontSize="lg"
                      fontFamily="Outfit"
                      fontWeight="700"
                      color={useColorModeValue("gray.800", "white")}
                    >
                      {feature.label}
                    </Text>
                    <Text
                      fontSize="sm"
                      color={textColor}
                      lineHeight="1.6"
                    >
                      {feature.desc}
                    </Text>
                  </VStack>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={28} bg={useColorModeValue("white", "gray.800")}>
        <Container maxW="7xl">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            mb={20}
          >
            <VStack spacing={5} textAlign="center">
              <Badge
                colorScheme="purple"
                px={5}
                py={2}
                rounded="full"
                fontSize="sm"
                fontWeight="600"
                textTransform="none"
              >
                Simple Process
              </Badge>
              <Heading
                size="3xl"
                fontFamily="Outfit"
                fontWeight="900"
                bgGradient="linear(to-r, purple.600, blue.500)"
                bgClip="text"
              >
                How MantleRWA Works
              </Heading>
              <Text fontSize="xl" color={textColor} maxW="3xl" lineHeight="1.8">
                Start investing in real-world assets in three simple steps.
                No complex procedures, no hidden fees.
              </Text>
            </VStack>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={12}>
            {[
              {
                step: "01",
                title: "Connect Wallet",
                description: "Connect your Mantle wallet securely. New to crypto? Create a wallet in under 2 minutes.",
                icon: FaRocket,
                color: "purple"
              },
              {
                step: "02",
                title: "Browse & Invest",
                description: "Explore verified assets, review detailed analytics, and invest with as little as $100.",
                icon: FaChartLine,
                color: "blue"
              },
              {
                step: "03",
                title: "Earn & Trade",
                description: "Track your portfolio, collect dividends, and trade shares 24/7 on our liquid marketplace.",
                icon: FaCoins,
                color: "green"
              }
            ].map((item, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <VStack
                  spacing={6}
                  p={10}
                  bg={cardBg}
                  rounded="3xl"
                  shadow="xl"
                  borderWidth="2px"
                  borderColor={useColorModeValue("gray.100", "gray.700")}
                  position="relative"
                  _hover={{
                    transform: "translateY(-10px)",
                    shadow: "2xl",
                    borderColor: `${item.color}.400`
                  }}
                  transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  h="full"
                >
                  {/* Step Number */}
                  <Box
                    position="absolute"
                    top="-20px"
                    left="50%"
                    transform="translateX(-50%)"
                    bg={`${item.color}.500`}
                    color="white"
                    w="60px"
                    h="60px"
                    rounded="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontFamily="Outfit"
                    fontWeight="900"
                    fontSize="2xl"
                    boxShadow="lg"
                  >
                    {item.step}
                  </Box>

                  {/* Icon */}
                  <Box
                    mt={8}
                    p={5}
                    bgGradient={`linear(to-br, ${item.color}.400, ${item.color}.600)`}
                    rounded="2xl"
                    boxShadow="xl"
                  >
                    <Icon as={item.icon} w={12} h={12} color="white" />
                  </Box>

                  {/* Content */}
                  <VStack spacing={4} textAlign="center">
                    <Heading
                      size="lg"
                      fontFamily="Outfit"
                      fontWeight="800"
                      color={useColorModeValue("gray.800", "white")}
                    >
                      {item.title}
                    </Heading>
                    <Text
                      fontSize="md"
                      color={textColor}
                      lineHeight="1.8"
                    >
                      {item.description}
                    </Text>
                  </VStack>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>

          {/* CTA for How It Works */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Flex justify="center" mt={16}>
              <Button
                as={Link}
                href="/collection"
                size="lg"
                h="60px"
                px={10}
                colorScheme="purple"
                fontSize="lg"
                fontFamily="Outfit"
                fontWeight="700"
                rightIcon={<FaArrowRight />}
                rounded="xl"
                boxShadow="lg"
                _hover={{
                  transform: "translateY(-4px) scale(1.05)",
                  boxShadow: "2xl"
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              >
                Get Started Now
              </Button>
            </Flex>
          </MotionBox>
        </Container>
      </Box>

      {/* Security & Compliance Section */}
      <Box
        py={20}
        bgGradient={useColorModeValue(
          "linear(to-br, gray.50, purple.50, blue.50)",
          "linear(to-br, gray.900, purple.900, blue.900)"
        )}
        position="relative"
        overflow="hidden"
      >
        {/* Background Pattern */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.03}
          backgroundImage="radial-gradient(circle, currentColor 1px, transparent 1px)"
          backgroundSize="30px 30px"
        />

        <Container maxW="7xl" position="relative" zIndex={1}>
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <VStack spacing={6} mb={16} textAlign="center">
              <Icon
                as={FaShieldAlt}
                w={16}
                h={16}
                color="purple.500"
                animation={`${pulse} 2s ease-in-out infinite`}
              />
              <Heading
                size="2xl"
                fontFamily="Outfit"
                fontWeight="900"
                bgGradient="linear(to-r, purple.600, blue.600)"
                bgClip="text"
              >
                Enterprise-Grade Security
              </Heading>
              <Text fontSize="xl" color={textColor} maxW="3xl" lineHeight="1.8">
                Your assets are protected by institutional-grade security measures
                and full regulatory compliance.
              </Text>
            </VStack>

            {/* Security Badges Grid */}
            <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={8}>
              {[
                { label: "Mantle\nSecured", icon: FaShieldAlt, color: "purple" },
                { label: "Smart Contract\nAudited", icon: FaCheckCircle, color: "green" },
                { label: "SEC\nCompliant", icon: FaCheckCircle, color: "blue" },
                { label: "Bank-Grade\nEncryption", icon: FaLock, color: "orange" },
                { label: "24/7\nMonitoring", icon: FaShieldAlt, color: "red" },
                { label: "Insurance\nProtected", icon: FaCheckCircle, color: "teal" }
              ].map((badge, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <VStack
                    spacing={4}
                    p={6}
                    bg={cardBg}
                    rounded="2xl"
                    shadow="md"
                    borderWidth="2px"
                    borderColor={`${badge.color}.100`}
                    _hover={{
                      transform: "translateY(-5px)",
                      shadow: "xl",
                      borderColor: `${badge.color}.400`
                    }}
                    transition="all 0.3s ease"
                    h="full"
                  >
                    <Icon
                      as={badge.icon}
                      w={10}
                      h={10}
                      color={`${badge.color}.500`}
                    />
                    <Text
                      fontSize="sm"
                      fontWeight="700"
                      textAlign="center"
                      lineHeight="1.4"
                      whiteSpace="pre-line"
                      color={useColorModeValue("gray.700", "gray.200")}
                    >
                      {badge.label}
                    </Text>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>
        </Container>
      </Box>


      {/* Featured Assets with Enhanced Animations */}
      <Container maxW="7xl" py={24}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <VStack spacing={12} mb={16}>
            <Heading
              size="2xl"
              textAlign="center"
              fontFamily="Outfit"
              fontWeight="800"
              bgGradient="linear(to-r, purple.400, blue.500)"
              bgClip="text"
            >
              Featured Real-World Assets
            </Heading>
            <Text
              fontSize="xl"
              color={textColor}
              textAlign="center"
              maxW="3xl"
              fontFamily="Inter"
              lineHeight="1.8"
            >
              Discover premium tokenized assets with verified ownership, regulatory compliance,
              and instant liquidity. Start investing with as little as $100.
            </Text>
          </VStack>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {NFT_CONTRACTS.slice(0, 6).map((item, index) => (
            <MotionCard
              key={item.address}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 }
              }}
              bg={cardBg}
              rounded="2xl"
              overflow="hidden"
              shadow="lg"
              _hover={{ shadow: "2xl" }}
              position="relative"
              cursor="pointer"
            >
              <Box position="relative" overflow="hidden">
                <Image
                  src={(item as any).imageUrl || (item as any).thumbnailUrl || '/placeholder-property.jpg'}
                  alt={(item as any).name || (item as any).title || 'Property'}
                  w="full"
                  h="240px"
                  objectFit="cover"
                  transition="transform 0.3s ease"
                  _hover={{ transform: "scale(1.05)" }}
                />
                <Box
                  position="absolute"
                  top={4}
                  right={4}
                  bg="whiteAlpha.900"
                  px={3}
                  py={1}
                  rounded="full"
                  backdropFilter="blur(10px)"
                >
                  <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                    {item.type}
                  </Badge>
                </Box>
              </Box>

              <CardBody p={6}>
                <VStack align="start" spacing={4}>
                  <Heading
                    size="md"
                    noOfLines={2}
                    fontFamily="Outfit"
                    fontWeight="700"
                  >
                    {(item as any).name || 'Property'}
                  </Heading>

                  <Text
                    color={textColor}
                    fontSize="sm"
                    noOfLines={3}
                    lineHeight="1.6"
                  >
                    {item.description || "Premium tokenized asset with verified ownership and regulatory compliance. Perfect for fractional investment opportunities."}
                  </Text>

                  <HStack justify="space-between" w="full" pt={2}>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color="gray.500" fontWeight="500">
                        Starting from
                      </Text>
                      <Text fontSize="lg" fontWeight="700" color="purple.500" fontFamily="Outfit">
                        $100
                      </Text>
                    </VStack>
                    <Badge colorScheme="green" variant="subtle" px={3} py={1}>
                      {item.chain?.name || "Multi-chain"}
                    </Badge>
                  </HStack>

                  <HStack spacing={3} w="full" pt={2}>
                    <Button
                      onClick={(e) => handleAssetClick(e, `/collection/${item.chain?.id?.toString() || 'default'}/${item.address}`)}
                      size="sm"
                      variant="outline"
                      colorScheme="purple"
                      flex={1}
                      fontFamily="Outfit"
                      fontWeight="600"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={(e) => handleAssetClick(e, `/collection/${item.chain?.id?.toString() || 'default'}/${item.address}?action=buy`)}
                      size="sm"
                      colorScheme="purple"
                      flex={1}
                      fontFamily="Outfit"
                      fontWeight="600"
                      rightIcon={<FaArrowRight />}
                    >
                      Buy Now
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </MotionCard>
          ))}
        </SimpleGrid>

        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Flex justify="center" mt={16}>
            <Button
              as={Link}
              href="/collection"
              size="xl"
              colorScheme="purple"
              px={12}
              py={8}
              fontSize="lg"
              fontFamily="Outfit"
              fontWeight="700"
              rightIcon={<FaArrowRight />}
              _hover={{
                transform: "translateY(-3px) scale(1.05)",
                boxShadow: "glowLg"
              }}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            >
              Explore All Assets
            </Button>
          </Flex>
        </MotionBox>
      </Container>

    </Box>
  );
}
