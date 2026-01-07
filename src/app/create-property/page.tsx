"use client";

import { Container, Box, Heading, Text, VStack } from "@chakra-ui/react";
import { CreatePropertyForm } from "@/components/CreatePropertyForm";
import { WalletGuard } from "@/components/WalletGuard";
import { useColorModeValue } from "@chakra-ui/react";

export default function CreatePropertyPage() {
  const gradient = useColorModeValue(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #1a0b2e 0%, #080420 100%)"
  );

  return (
    <WalletGuard requireWallet={true}>
      <Box
        bg={gradient}
        minH="100vh"
        py={{ base: 12, md: 20 }}
        position="relative"
        overflow="hidden"
      >
        {/* Animated Orbs Background */}
        <Box
          position="absolute"
          top="-10%"
          right="-5%"
          w="600px"
          h="600px"
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
          w="500px"
          h="500px"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(118,75,162,0.3) 0%, transparent 70%)"
          filter="blur(60px)"
          animation="float 10s ease-in-out infinite reverse"
        />

        <Container maxW="5xl" position="relative" zIndex={1}>
          <VStack spacing={12} align="stretch">
            {/* Hero Header */}
            <Box
              textAlign="center"
              animation="fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
              sx={{
                "@keyframes fadeInUp": {
                  from: { opacity: 0, transform: "translateY(30px)" },
                  to: { opacity: 1, transform: "translateY(0)" }
                }
              }}
            >
              <Heading
                size="3xl"
                mb={4}
                fontWeight="900"
                color="white"
                letterSpacing="tight"
                fontFamily="Outfit"
              >
                Create Property NFT
              </Heading>
              <Text
                fontSize="xl"
                color="whiteAlpha.900"
                fontWeight="500"
                maxW="2xl"
                mx="auto"
                fontFamily="Inter"
                lineHeight="1.6"
              >
                Tokenize your real estate asset and enable fractional ownership on Mantle
              </Text>
            </Box>

            {/* Form Component */}
            <Box
              animation="fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both"
            >
              <CreatePropertyForm />
            </Box>
          </VStack>
        </Container>
      </Box>
    </WalletGuard>
  );
}
