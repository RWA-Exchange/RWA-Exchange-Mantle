"use client";

import { ProfileSection } from "@/components/profile-page/Profile";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();

  if (!isConnected || !address)
    return (
      <Box>
        <Flex direction="column" align="center" justify="center" h="50vh">
          <Heading mb={6}>Connect Wallet to continue</Heading>
          <ConnectButton />
        </Flex>
      </Box>
    );
  return <ProfileSection address={address} />;
}
