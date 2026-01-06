import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  Flex,
  Text,
} from "@chakra-ui/react";

export function NftAttributes({
  attributes,
}: {
  attributes: Record<string, unknown> | Record<string, unknown>[];
}) {
  /**
   * Assume the NFT attributes follow the conventional format
   */
  type Attr = {
    trait_type?: string;
    traitType?: string;
    value?: unknown;
    [key: string]: unknown;
  };

  // Normalize attributes into an array of { trait_type, value }
  let items: Attr[] = [];
  if (Array.isArray(attributes)) {
    items = (attributes as Attr[]).filter(
      (item: Attr) => !!(item.trait_type || item.traitType)
    );
  } else if (attributes && typeof attributes === "object") {
    items = Object.entries(attributes).map(([key, value]) => ({
      trait_type: key,
      value,
    }));
  }
  return (
    <AccordionItem>
      <Text>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            Traits
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </Text>
      <AccordionPanel pb={4}>
        <Flex direction="row" wrap="wrap" gap="3">
          {items.map((item) => (
            <Card
              key={(item.trait_type || item.traitType || "").toString()}
              as={Flex}
              flexDir="column"
              gap={2}
              py={2}
              px={4}
              bg={"transparent"}
              border="1px"
            >
              {(item.trait_type || item.traitType) && (
                <Text size="label.sm" textAlign="center" lineHeight={1.2}>
                  {item.trait_type || item.traitType}
                </Text>
              )}
              {(() => {
                const displayValue =
                  typeof item.value === "object"
                    ? JSON.stringify(item.value ?? {})
                    : String(item.value ?? "");
                return (
                  <Text size="label.md" textAlign="center" fontWeight="bold">
                    {displayValue}
                  </Text>
                );
              })()}
            </Card>
          ))}
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
}
