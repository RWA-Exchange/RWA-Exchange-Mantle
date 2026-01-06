import { Badge, Flex, Icon } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

export function ComplianceBadge({ verified }: { verified?: boolean }) {
  if (!verified) return null;
  return (
    <Badge colorScheme="green" display="inline-flex" alignItems="center" gap={1}>
      <Icon as={CheckIcon} boxSize={3} /> Compliant
    </Badge>
  );
}
