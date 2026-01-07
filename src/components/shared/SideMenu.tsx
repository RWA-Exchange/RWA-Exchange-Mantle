"use client";

import { HamburgerIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useColorMode,
  useDisclosure,
  VStack,
  Badge,
  HStack,
  Text,
  Divider,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FaRegMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";

export function SideMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <Button
        display={{ lg: "none", base: "block" }}
        ref={btnRef}
        onClick={onOpen}
      >
        <HamburgerIcon />
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Button height="56px" w="56px" onClick={toggleColorMode} mr="10px">
              {colorMode === "light" ? <FaRegMoon /> : <IoSunny />}
            </Button>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <ConnectButton />
              </Box>

              {isConnected && address && (
                <>
                  <Divider />
                  <VStack spacing={2} align="stretch">
                    <Text fontSize="sm" fontWeight="bold" color="gray.600">
                      Mantle Network
                    </Text>

                    <HStack justify="space-between">
                      <Text fontSize="sm">Status:</Text>
                      <Badge colorScheme="green" variant="solid">
                        Connected
                      </Badge>
                    </HStack>

                    <HStack justify="space-between">
                      <Text fontSize="sm">Network:</Text>
                      <Badge colorScheme="blue" variant="solid">
                        Mantle Sepolia
                      </Badge>
                    </HStack>
                  </VStack>
                  <Divider />
                </>
              )}

              <Link href="/landing" _hover={{ textDecoration: "none" }} onClick={onClose}>
                <Button variant="ghost" w="full" justifyContent="flex-start">
                  About
                </Button>
              </Link>

              <Link href="/dashboard" _hover={{ textDecoration: "none" }} onClick={onClose}>
                <Button variant="ghost" w="full" justifyContent="flex-start">
                  Dashboard
                </Button>
              </Link>

              <Link href="/collection" _hover={{ textDecoration: "none" }} onClick={onClose}>
                <Button variant="ghost" w="full" justifyContent="flex-start">
                  Marketplace
                </Button>
              </Link>

              {isConnected && address && (
                <Link href="/profile" _hover={{ textDecoration: "none" }} onClick={onClose}>
                  <Button variant="ghost" w="full" justifyContent="flex-start">
                    Profile
                  </Button>
                </Link>
              )}
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            {isConnected && (
              <Button
                onClick={() => {
                  disconnect();
                  onClose();
                }}
                colorScheme="red"
                variant="outline"
              >
                Disconnect Wallet
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
