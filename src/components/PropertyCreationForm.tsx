import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  Select,
  Image,
  Text,
  useToast,
  Progress,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  Badge,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FiUpload, FiImage, FiDollarSign, FiHome, FiMapPin } from 'react-icons/fi';
import { useAccount } from 'wagmi';
import { useEthersSigner } from '@/hooks/useEthersSigner';
import { propertyContractService } from '@/services/propertyContract';

interface PropertyFormData {
  name: string;
  description: string;
  location: string;
  propertyType: string;
  totalValue: number;
  totalShares: number;
  pricePerShare: number;
  rentalYield: string;
  imageFile: File | null;
  imageUrl: string;
}

const PropertyCreationForm: React.FC = () => {
  const { address, isConnected } = useAccount();
  const signer = useEthersSigner();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    description: '',
    location: '',
    propertyType: 'residential',
    totalValue: 0,
    totalShares: 100,
    pricePerShare: 0,
    rentalYield: '',
    imageFile: null,
    imageUrl: ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer YOUR_PINATA_JWT_TOKEN`,
        },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        return URL.createObjectURL(file);
      }

      const result = await response.json();
      return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;

    } catch (error) {
      return URL.createObjectURL(file);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file type', description: 'Please select an image file', status: 'error', duration: 3000 });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please select an image smaller than 5MB', status: 'error', duration: 3000 });
      return;
    }

    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, imageFile: file, imageUrl }));
      toast({ title: 'Image uploaded successfully', status: 'success', duration: 3000 });
    } catch (error) {
      toast({ title: 'Upload failed', description: 'Failed to upload image', status: 'error', duration: 3000 });
    }
  };

  const createPropertyNFT = async () => {
    if (!isConnected || !address || !signer) {
      toast({ title: 'Wallet Not Connected', description: 'Please connect your Mantle wallet first', status: 'error', duration: 4000 });
      return;
    }

    if (!formData.name || !formData.description || !formData.location || !formData.imageUrl) {
      toast({ title: 'Missing Information', description: 'Please fill in all required fields and upload an image', status: 'error', duration: 4000 });
      return;
    }

    setIsCreating(true);
    setStatusMessage("Preparing property creation...");

    try {
      setStatusMessage("Please approve the transaction in your wallet...");

      toast({ title: 'Sign Transaction', description: 'Please approve the property creation in your wallet', status: 'info', duration: 3000 });

      const propertyData = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
        location: formData.location,
        propertyType: formData.propertyType,
        totalValue: formData.totalValue,
        totalShares: formData.totalShares,
        pricePerShare: formData.pricePerShare,
        rentalYield: formData.rentalYield,
      };

      setStatusMessage("Processing on blockchain...");

      const result = await propertyContractService.createProperty(propertyData, signer);


      if (result.success) {
        setStatusMessage("Property created successfully!");
        const txHash = result.transactionHash;
        const explorerUrl = `https://sepolia.mantlescan.xyz/tx/${txHash}`;

        toast({
          title: 'Property NFT Created! 🎉',
          description: (
            <VStack align="start" spacing={2} w="full">
              <Text>Your property has been successfully tokenized!</Text>
              <Box p={2} bg="gray.100" borderRadius="md" w="full" fontSize="xs" fontFamily="mono">
                <Text fontWeight="bold" mb={1}>Transaction Hash:</Text>
                <Text noOfLines={1}>{txHash}</Text>
              </Box>
              <HStack spacing={2} w="full">
                <Button size="sm" colorScheme="green" variant="outline" flex={1}
                  onClick={() => { navigator.clipboard.writeText(txHash || ''); toast({ title: "Copied!", status: "success", duration: 2000 }); }}>
                  📋 Copy Hash
                </Button>
                <Button as="a" href={explorerUrl} target="_blank" size="sm" colorScheme="green" flex={1}>
                  🔍 View on MantleScan
                </Button>
              </HStack>
            </VStack>
          ),
          status: "success",
          duration: 15000,
          isClosable: true,
        });

        setTimeout(() => {
          setFormData({ name: '', description: '', location: '', propertyType: 'residential', totalValue: 0, totalShares: 100, pricePerShare: 0, rentalYield: '', imageFile: null, imageUrl: '' });
          setStatusMessage("");
        }, 2000);
      } else {
        throw new Error(result.error || "Property creation failed");
      }
    } catch (error: any) {
      setStatusMessage("");
      const errorMessage = error?.message || 'Unknown error';

      if (errorMessage.includes('User rejected') || errorMessage.includes('cancelled') || errorMessage.includes('denied')) {
        toast({ title: 'Transaction Cancelled', description: 'You cancelled the property creation. No fees were charged.', status: 'warning', duration: 5000 });
      } else if (errorMessage.includes('insufficient')) {
        toast({ title: 'Insufficient Funds', description: 'You need more MNT for gas fees.', status: 'error', duration: 5000 });
      } else {
        toast({ title: 'Creation Failed', description: 'Failed to create property NFT. Please try again.', status: 'error', duration: 5000 });
      }
    } finally {
      setIsCreating(false);
    }
  };


  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'totalValue' || field === 'totalShares') {
      const totalValue = field === 'totalValue' ? value : formData.totalValue;
      const totalShares = field === 'totalShares' ? value : formData.totalShares;

      if (totalValue > 0 && totalShares > 0) {
        const pricePerShare = Math.round(totalValue / totalShares);
        setFormData(prev => ({ ...prev, pricePerShare }));
      }
    }
  };

  return (
    <Box maxW="4xl" mx="auto" p={6}>
      <Card bg={bgColor} borderColor={borderColor}>
        <CardHeader>
          <Heading size="lg" color="blue.500">
            <Icon as={FiHome} mr={3} />
            Create Property NFT
          </Heading>
          <Text color="gray.600" mt={2}>Tokenize your real estate property with fractional ownership</Text>
        </CardHeader>

        <CardBody>
          <VStack spacing={6} align="stretch">
            {isCreating && statusMessage && (
              <Box p={4} bg="blue.50" borderRadius="md" borderWidth="1px" borderColor="blue.200">
                <Text color="blue.700" fontWeight="medium">{statusMessage}</Text>
              </Box>
            )}

            <Box>
              <FormLabel fontWeight="bold">Property Image *</FormLabel>
              <VStack spacing={4}>
                {formData.imageUrl ? (
                  <Box position="relative">
                    <Image src={formData.imageUrl} alt="Property preview" maxH="300px" borderRadius="lg" objectFit="cover" />
                    <Badge position="absolute" top={2} right={2} colorScheme="green">Uploaded</Badge>
                  </Box>
                ) : (
                  <Box border="2px dashed" borderColor={borderColor} borderRadius="lg" p={8} textAlign="center" cursor="pointer"
                    onClick={() => fileInputRef.current?.click()} _hover={{ borderColor: 'blue.400' }}>
                    <Icon as={FiImage} boxSize={12} color="gray.400" mb={4} />
                    <Text color="gray.600">Click to upload property image</Text>
                    <Text fontSize="sm" color="gray.400">Supports JPG, PNG (max 5MB)</Text>
                  </Box>
                )}

                <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} display="none" />
                <Button leftIcon={<FiUpload />} onClick={() => fileInputRef.current?.click()} variant="outline" isLoading={isUploading} loadingText="Uploading...">
                  {formData.imageUrl ? 'Change Image' : 'Upload Image'}
                </Button>
                {isUploading && <Progress value={uploadProgress} colorScheme="blue" w="100%" />}
              </VStack>
            </Box>

            <Divider />


            <VStack spacing={4} align="stretch">
              <Heading size="md" color="gray.700"><Icon as={FiHome} mr={2} />Basic Information</Heading>

              <FormControl isRequired>
                <FormLabel>Property Name</FormLabel>
                <Input value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="e.g., Luxury Downtown Apartment" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Detailed description of the property..." rows={4} />
              </FormControl>

              <HStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel><Icon as={FiMapPin} mr={1} />Location</FormLabel>
                  <Input value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="e.g., New York, NY" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Property Type</FormLabel>
                  <Select value={formData.propertyType} onChange={(e) => handleInputChange('propertyType', e.target.value)}>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="land">Land</option>
                  </Select>
                </FormControl>
              </HStack>
            </VStack>

            <Divider />

            <VStack spacing={4} align="stretch">
              <Heading size="md" color="gray.700"><Icon as={FiDollarSign} mr={2} />Financial Details</Heading>

              <HStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Total Property Value (MNT)</FormLabel>
                  <NumberInput value={formData.totalValue} onChange={(_, value) => handleInputChange('totalValue', value)} min={0}>
                    <NumberInputField placeholder="1000000" />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Total Shares</FormLabel>
                  <NumberInput value={formData.totalShares} onChange={(_, value) => handleInputChange('totalShares', value)} min={1}>
                    <NumberInputField placeholder="100" />
                  </NumberInput>
                </FormControl>
              </HStack>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Price per Share (MNT)</FormLabel>
                  <NumberInput value={formData.pricePerShare} onChange={(_, value) => handleInputChange('pricePerShare', value)} min={0}>
                    <NumberInputField placeholder="Auto-calculated" />
                  </NumberInput>
                  <Text fontSize="sm" color="gray.500">Auto-calculated from total value ÷ total shares</Text>
                </FormControl>

                <FormControl>
                  <FormLabel>Expected Rental Yield</FormLabel>
                  <Input value={formData.rentalYield} onChange={(e) => handleInputChange('rentalYield', e.target.value)} placeholder="e.g., 8% annually" />
                </FormControl>
              </HStack>
            </VStack>

            <Divider />


            <Card bg="blue.50" borderColor="blue.200">
              <CardBody>
                <Heading size="sm" mb={3}>Property Summary</Heading>
                <VStack align="start" spacing={2}>
                  <Text><strong>Total Value:</strong> {formData.totalValue.toLocaleString()} MNT</Text>
                  <Text><strong>Total Shares:</strong> {formData.totalShares}</Text>
                  <Text><strong>Price per Share:</strong> {formData.pricePerShare.toLocaleString()} MNT</Text>
                  <Text><strong>Minimum Investment:</strong> {formData.pricePerShare.toLocaleString()} MNT (1 share)</Text>
                </VStack>
              </CardBody>
            </Card>

            {!isConnected ? (
              <VStack spacing={4}>
                <Text color="gray.600" textAlign="center">Connect your Mantle wallet to create property NFTs</Text>
                {/* Connection button hidden as it is in Navbar, or show placeholder */}
                <Box p={4} bg="gray.100" borderRadius="md">
                  <Text fontSize="sm" color="gray.600">Please connect wallet using the button in the top right corner.</Text>
                </Box>
              </VStack>
            ) : (
              <VStack spacing={4}>
                <Card bg="green.50" borderColor="green.200" w="100%">
                  <CardBody>
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" fontWeight="bold" color="green.700">Wallet Connected</Text>
                        <Text fontSize="xs" color="green.600">{address?.slice(0, 8)}...{address?.slice(-6)}</Text>
                      </VStack>
                      <Badge colorScheme="green">Mantle</Badge>
                    </HStack>
                  </CardBody>
                </Card>

                <Button colorScheme="blue" size="lg" onClick={createPropertyNFT} isLoading={isCreating} loadingText="Creating Property NFT..."
                  isDisabled={!formData.name || !formData.description || !formData.location || !formData.imageUrl} w="100%">
                  Create Property NFT
                </Button>
              </VStack>
            )}
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default PropertyCreationForm;