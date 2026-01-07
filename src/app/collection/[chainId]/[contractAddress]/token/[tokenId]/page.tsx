"use client";

import { Token } from "@/components/token-page/TokenPage";

import { useParams } from "next/navigation";

export default function TokenPage() {
  const params = useParams();
  const tokenId = params.tokenId as string;

  if (!tokenId) {
    throw new Error("Missing tokenId");
  }
  return <Token tokenId={tokenId} />;
}
