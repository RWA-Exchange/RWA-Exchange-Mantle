"use client";

import { Link } from "@chakra-ui/next-js";
import {
    Box,
    Container,
    Flex,
    Heading,
    Text,
    VStack,
    HStack,
    SimpleGrid,
    Image,
    Input,
    Button,
    useColorModeValue,
    Icon,
    Divider,
} from "@chakra-ui/react";
import { FaTwitter, FaGithub, FaDiscord, FaTelegram } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

export function Footer() {
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.600", "gray.400");

    return (
        <Box
            as="footer"
            bg={bgColor}
            borderTopWidth="1px"
            borderColor={borderColor}
            pt={16}
            pb={8}
        >
            <Container maxW="7xl">
                <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={10} mb={12}>
                    {/* Brand Column */}
                    <VStack align="start" spacing={4} gridColumn={{ base: "span 1", md: "span 2", lg: "span 1" }}>
                        <HStack spacing={2}>
                            <Image
                                src="/logo.png"
                                alt="OneRWA Logo"
                                height="36px"
                                width="auto"
                            />
                            <Heading
                                size="md"
                                bgGradient="linear(to-r, purple.600, blue.500)"
                                bgClip="text"
                                fontFamily="Outfit"
                                fontWeight="900"
                            >
                                OneRWA
                            </Heading>
                        </HStack>
                        <Text fontSize="sm" color={textColor} lineHeight="1.8" maxW="300px">
                            The next-generation platform for tokenizing and trading real-world assets
                            with institutional-grade security on OneChain.
                        </Text>
                        {/* Social Icons */}
                        <HStack spacing={3} pt={2}>
                            {[
                                { icon: FaTwitter, href: "#", label: "Twitter" },
                                { icon: FaGithub, href: "#", label: "GitHub" },
                                { icon: FaDiscord, href: "#", label: "Discord" },
                                { icon: FaTelegram, href: "#", label: "Telegram" },
                            ].map((social, index) => (
                                <Link
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    _hover={{ textDecoration: "none" }}
                                >
                                    <Box
                                        p={2.5}
                                        rounded="lg"
                                        bg={useColorModeValue("white", "gray.800")}
                                        borderWidth="1px"
                                        borderColor={useColorModeValue("gray.200", "gray.700")}
                                        _hover={{
                                            bg: "purple.500",
                                            borderColor: "purple.500",
                                            color: "white",
                                            transform: "translateY(-3px)",
                                            boxShadow: "lg"
                                        }}
                                        transition="all 0.3s ease"
                                        cursor="pointer"
                                    >
                                        <Icon as={social.icon} boxSize={4} />
                                    </Box>
                                </Link>
                            ))}
                        </HStack>
                    </VStack>

                    {/* Platform Links */}
                    <VStack align="start" spacing={4}>
                        <Heading size="sm" fontFamily="Outfit" fontWeight="700">
                            Platform
                        </Heading>
                        {[
                            { label: "Marketplace", href: "/collection" },
                            { label: "Create Asset", href: "/create-property" },
                            { label: "My Portfolio", href: "/my-investments" },
                            { label: "Dashboard", href: "/dashboard" },
                        ].map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                fontSize="sm"
                                color={textColor}
                                _hover={{
                                    color: "purple.500",
                                    textDecoration: "none",
                                    transform: "translateX(4px)"
                                }}
                                transition="all 0.2s ease"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </VStack>

                    {/* Resources */}
                    <VStack align="start" spacing={4}>
                        <Heading size="sm" fontFamily="Outfit" fontWeight="700">
                            Resources
                        </Heading>
                        {[
                            { label: "Documentation", href: "#" },
                            { label: "API Reference", href: "#" },
                            { label: "Help Center", href: "#" },
                            { label: "Blog", href: "#" },
                        ].map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                fontSize="sm"
                                color={textColor}
                                _hover={{
                                    color: "purple.500",
                                    textDecoration: "none",
                                    transform: "translateX(4px)"
                                }}
                                transition="all 0.2s ease"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </VStack>

                    {/* Company */}
                    <VStack align="start" spacing={4}>
                        <Heading size="sm" fontFamily="Outfit" fontWeight="700">
                            Company
                        </Heading>
                        {[
                            { label: "About Us", href: "/landing" },
                            { label: "Careers", href: "#" },
                            { label: "Contact", href: "#" },
                            { label: "Partners", href: "#" },
                        ].map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                fontSize="sm"
                                color={textColor}
                                _hover={{
                                    color: "purple.500",
                                    textDecoration: "none",
                                    transform: "translateX(4px)"
                                }}
                                transition="all 0.2s ease"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </VStack>

                    {/* Newsletter */}
                    <VStack align="start" spacing={4}>
                        <Heading size="sm" fontFamily="Outfit" fontWeight="700">
                            Stay Updated
                        </Heading>
                        <Text fontSize="sm" color={textColor} lineHeight="1.6">
                            Get the latest updates on new assets and platform features.
                        </Text>
                        <Flex
                            as="form"
                            w="full"
                            maxW="300px"
                            bg={useColorModeValue("white", "gray.800")}
                            rounded="lg"
                            borderWidth="1px"
                            borderColor={useColorModeValue("gray.200", "gray.700")}
                            p={1.5}
                            _focusWithin={{
                                borderColor: "purple.500",
                                boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)"
                            }}
                            transition="all 0.2s ease"
                        >
                            <Input
                                placeholder="Enter email"
                                size="sm"
                                border="none"
                                _focus={{ boxShadow: "none" }}
                                fontSize="sm"
                                flex={1}
                            />
                            <Button
                                size="sm"
                                colorScheme="purple"
                                rounded="md"
                                px={4}
                                _hover={{ transform: "scale(1.05)" }}
                                transition="all 0.2s ease"
                            >
                                <Icon as={FiArrowRight} />
                            </Button>
                        </Flex>
                    </VStack>
                </SimpleGrid>

                <Divider borderColor={borderColor} mb={8} />

                {/* Bottom Bar */}
                <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align="center"
                    gap={4}
                >
                    <Text fontSize="sm" color={textColor} textAlign={{ base: "center", md: "left" }}>
                        © {new Date().getFullYear()} OneRWA. All rights reserved. Built on OneChain.
                    </Text>
                    <HStack spacing={6} flexWrap="wrap" justify={{ base: "center", md: "flex-end" }}>
                        {[
                            { label: "Privacy Policy", href: "#" },
                            { label: "Terms of Service", href: "#" },
                            { label: "Security", href: "#" },
                        ].map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                fontSize="sm"
                                color={textColor}
                                _hover={{
                                    color: "purple.500",
                                    textDecoration: "none"
                                }}
                                transition="all 0.2s ease"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
}
