import React from 'react';
import { Box, Text } from '@chakra-ui/react';

/**
 * Legacy WalletDebug component. 
 * This component is currently placeholder-only to avoid build errors.
 * Original functionality was based on a legacy wallet system.
 */
export const WalletDebug: React.FC = () => {
  return (
    <Box p={4} border="1px solid" borderColor="gray.200" borderRadius="md" bg="gray.50">
      <Text fontWeight="bold">Wallet Connection Debug (Legacy)</Text>
      <Text fontSize="sm">This component has been disabled as part of the Mantle migration.</Text>
    </Box>
  );
};