"use client";

import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image,
  useColorMode,
  HStack,
  Text,
} from "@chakra-ui/react";
import { blo } from "blo";
import { FaRegMoon } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { IoSunny } from "react-icons/io5";
import { SideMenu } from "./SideMenu";
import { DappKitWalletButton } from "@/components/DappKitWalletButton";
import { useDappKit } from "@/hooks/useDappKit";
import { usePathname } from "next/navigation";

export function Navbar() {
  const {
    isConnected,
    account,
    disconnect
  } = useDappKit();

  const pathname = usePathname();

  const handleLogout = async () => {
    await disconnect();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <Flex
      position="sticky"
      top={0}
      zIndex={1000}
      mx={{ base: "16px", lg: "40px" }}
      direction="row"
      justifyContent="space-between"
      align="center"
      bg="rgba(255, 255, 255, 0.8)"
      backdropFilter="blur(20px) saturate(180%)"
      borderRadius="24px"
      px={{ base: "20px", lg: "32px" }}
      py="16px"
      boxShadow="0 8px 32px rgba(102, 126, 234, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)"
      borderWidth="1px"
      borderColor="rgba(118, 75, 162, 0.15)"
      _dark={{
        bg: "rgba(26, 32, 44, 0.8)",
        borderColor: "rgba(118, 75, 162, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(102, 126, 234, 0.15)"
      }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        boxShadow: "0 12px 40px rgba(102, 126, 234, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)",
        transform: "translateY(-2px)"
      }}
    >
      {/* Left Section - Logo */}
      <Flex flex={{ base: "0", lg: "1" }} justify="flex-start">
        <HStack spacing={3}>
          <Image
            src="/logo.png"
            alt="OneRWA Logo"
            height={{ base: "32px", md: "38px" }}
            width="auto"
            filter="drop-shadow(0 2px 8px rgba(102, 126, 234, 0.3))"
            transition="all 0.3s ease"
            _hover={{
              filter: "drop-shadow(0 4px 12px rgba(102, 126, 234, 0.5))",
              transform: "scale(1.05)"
            }}
          />
          <Heading
            as={Link}
            href="/"
            bgGradient="linear(to-r, purple.600, blue.500)"
            bgClip="text"
            fontFamily="Outfit"
            fontWeight="900"
            letterSpacing="tight"
            size={{ base: "md", md: "lg" }}
            display={{ base: "none", sm: "block" }}
            transition="all 0.3s ease"
            _hover={{
              textDecoration: "none",
              bgGradient: "linear(to-r, purple.500, blue.400)",
              transform: "translateY(-1px)"
            }}
          >
            OneRWA
          </Heading>
        </HStack>
      </Flex>

      {/* Center Section - Navigation (Desktop Only) */}
      <Flex flex="0" display={{ lg: "flex", base: "none" }}>
        <HStack
          spacing={1}
          bg="rgba(247, 250, 252, 0.8)"
          rounded="full"
          p={1.5}
          backdropFilter="blur(10px)"
          borderWidth="1px"
          borderColor="rgba(118, 75, 162, 0.12)"
          boxShadow="inset 0 1px 2px rgba(0, 0, 0, 0.05)"
          _dark={{
            bg: "rgba(45, 55, 72, 0.8)",
            borderColor: "rgba(118, 75, 162, 0.15)",
            boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.2)"
          }}
        >
          <NavLink href="/landing" isActive={isActive("/landing")}>
            About
          </NavLink>
          <NavLink href="/create-property" isActive={isActive("/create-property")}>
            Create
          </NavLink>
          <NavLink href="/collection" isActive={isActive("/collection")}>
            Marketplace
          </NavLink>
          <NavLink href="/my-investments" isActive={isActive("/my-investments")} color="green">
            Portfolio
          </NavLink>
          <NavLink href="/dashboard" isActive={isActive("/dashboard")}>
            Dashboard
          </NavLink>
        </HStack>
      </Flex>

      {/* Right Section - Action Buttons (Desktop) */}
      <Flex
        flex={{ base: "0", lg: "1" }}
        justify="flex-end"
        display={{ lg: "flex", base: "none" }}
      >
        <HStack spacing={2}>
          <ToggleThemeButton />
          <DappKitWalletButton />
          {isConnected && account?.address && (
            <ProfileButton address={account.address} onLogout={handleLogout} />
          )}
        </HStack>
      </Flex>

      {/* Mobile Menu */}

      <SideMenu />
    </Flex>
  );
}

// New NavLink Component with Glassmorphism
function NavLink({
  href,
  isActive,
  children,
  color = "purple"
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <Link href={href} _hover={{ textDecoration: "none" }}>
      <Box
        px={5}
        py={2.5}
        rounded="full"
        bg={isActive ? `${color}.500` : "transparent"}
        color={isActive ? "white" : "gray.800"}
        _dark={{
          color: isActive ? "white" : "gray.200"
        }}
        fontWeight={isActive ? "700" : "600"}
        fontSize="sm"
        fontFamily="Outfit"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        cursor="pointer"
        boxShadow={isActive ? "0 2px 8px rgba(102, 126, 234, 0.3)" : "none"}
        _hover={{
          bg: isActive ? `${color}.600` : `${color}.50`,
          transform: "translateY(-2px)",
          color: isActive ? "white" : `${color}.600`,
          boxShadow: isActive ? "0 4px 12px rgba(102, 126, 234, 0.4)" : "0 2px 8px rgba(102, 126, 234, 0.15)",
          _dark: {
            bg: isActive ? `${color}.600` : "rgba(118, 75, 162, 0.15)",
            color: isActive ? "white" : `${color}.300`
          }
        }}
        _active={{
          transform: "translateY(0)"
        }}
      >
        {children}
      </Box>
    </Link>
  );
}

function ProfileButton({ address, onLogout }: { address: string; onLogout: () => void }) {
  return (
    <Menu>
      <MenuButton
        as={Button}
        height="44px"
        px="14px"
        rounded="full"
        bg="rgba(247, 250, 252, 0.8)"
        backdropFilter="blur(10px)"
        borderWidth="1px"
        borderColor="rgba(102, 126, 234, 0.2)"
        _dark={{
          bg: "rgba(45, 55, 72, 0.8)",
          borderColor: "rgba(102, 126, 234, 0.3)"
        }}
        _hover={{
          bg: "rgba(237, 242, 247, 0.9)",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
          _dark: {
            bg: "rgba(55, 65, 82, 0.9)"
          }
        }}
        _active={{
          transform: "translateY(0)"
        }}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        <Flex direction="row" gap="2" align="center">
          <Box>
            <FiUser size={18} />
          </Box>
          <Image
            src={blo(address as `0x${string}`)}
            height="26px"
            width="26px"
            rounded="full"
            boxShadow="sm"
          />
        </Flex>
      </MenuButton>
      <MenuList
        rounded="2xl"
        overflow="hidden"
        borderWidth="1px"
        borderColor="rgba(102, 126, 234, 0.1)"
        boxShadow="0 8px 24px rgba(0, 0, 0, 0.12)"
        bg="rgba(255, 255, 255, 0.95)"
        backdropFilter="blur(20px)"
        _dark={{
          bg: "rgba(26, 32, 44, 0.95)",
          borderColor: "rgba(255, 255, 255, 0.1)"
        }}
      >
        <MenuItem
          as={Link}
          href="/profile"
          _hover={{
            textDecoration: "none",
            bg: "purple.50",
            _dark: { bg: "rgba(102, 126, 234, 0.1)" }
          }}
          fontFamily="Outfit"
          fontWeight="600"
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={onLogout}
          _hover={{
            bg: "red.50",
            color: "red.600",
            _dark: { bg: "rgba(245, 101, 101, 0.1)", color: "red.400" }
          }}
          fontFamily="Outfit"
          fontWeight="600"
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}


function ToggleThemeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button
      height="44px"
      w="44px"
      onClick={toggleColorMode}
      rounded="full"
      bg="rgba(247, 250, 252, 0.8)"
      backdropFilter="blur(10px)"
      borderWidth="1px"
      borderColor="rgba(102, 126, 234, 0.2)"
      _dark={{
        bg: "rgba(45, 55, 72, 0.8)",
        borderColor: "rgba(102, 126, 234, 0.3)"
      }}
      _hover={{
        bg: "rgba(237, 242, 247, 0.9)",
        transform: "translateY(-2px) rotate(15deg)",
        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
        _dark: {
          bg: "rgba(55, 65, 82, 0.9)"
        }
      }}
      _active={{
        transform: "translateY(0) rotate(0deg)"
      }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      {colorMode === "light" ? <FaRegMoon size={18} /> : <IoSunny size={20} />}
    </Button>
  );
}