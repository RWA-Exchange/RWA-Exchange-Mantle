"use client";

import { ProfileSection } from "@/components/profile-page/Profile";
import { Box, Text } from "@chakra-ui/react";
import { useParams, notFound } from "next/navigation";

function isEvmAddress(input: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(input);
}

export default function PublicProfilePage() {
  const params = useParams();
  const addressOrENS = params.addressOrENS as string;

  const isValidEvmAddress = isEvmAddress(addressOrENS);
  if (!isValidEvmAddress) return notFound();
  return <ProfileSection address={addressOrENS} />;
}
