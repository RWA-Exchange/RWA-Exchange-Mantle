"use client";

import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Alert,
  AlertIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import { logger } from '@/utils/secureLogger';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error securely without exposing sensitive data
    logger.error('React Error Boundary caught error', {
      message: error.message,
      stack: error.stack?.substring(0, 500), // Limit stack trace
      componentStack: errorInfo.componentStack?.substring(0, 500)
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box
      minH="50vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={8}
      bg={bgColor}
      color={textColor}
    >
      <VStack spacing={6} textAlign="center" maxW="md">
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          Something went wrong
        </Alert>
        
        <VStack spacing={4}>
          <Heading size="lg" fontFamily="Outfit">
            Oops! Something went wrong
          </Heading>
          
          <Text color="gray.500" fontSize="md">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </Text>
          
          {process.env.NODE_ENV === 'development' && error && (
            <Box
              p={4}
              bg="red.50"
              borderRadius="md"
              fontSize="sm"
              fontFamily="mono"
              color="red.800"
              maxW="full"
              overflow="auto"
            >
              <Text fontWeight="bold" mb={2}>Error Details (Development Only):</Text>
              <Text>{error.message}</Text>
            </Box>
          )}
        </VStack>
        
        <VStack spacing={3}>
          <Button
            onClick={resetError}
            colorScheme="blue"
            size="lg"
            fontFamily="Outfit"
            fontWeight="700"
          >
            Try Again
          </Button>
          
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="md"
            fontFamily="Outfit"
          >
            Refresh Page
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}

export default ErrorBoundary;