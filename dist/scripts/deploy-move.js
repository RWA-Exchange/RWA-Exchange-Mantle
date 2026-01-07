"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployContract = deployContract;
const client_1 = require("@mysten/sui/client");
const ed25519_1 = require("@mysten/sui/keypairs/ed25519");
const transactions_1 = require("@mysten/sui/transactions");
const utils_1 = require("@mysten/sui/utils");
const fs_1 = require("fs");
const path_1 = require("path");
const child_process_1 = require("child_process");
// Configuration for Mantle
const NETWORK = 'Mantle-testnet';
const RPC_URL = 'https://testnet-rpc.Mantle.one';
async function deployContract() {
    console.log('🚀 Starting RWA Exchange Move contract deployment...');
    try {
        // Initialize Sui client
        const client = new client_1.SuiClient({ url: RPC_URL });
        console.log(`📡 Connected to Sui ${NETWORK} at ${RPC_URL}`);
        // Load or create keypair
        let keypair;
        const keypairPath = (0, path_1.join)(process.cwd(), '.sui-keypair');
        if ((0, fs_1.existsSync)(keypairPath)) {
            console.log('🔑 Loading existing keypair...');
            const keypairData = (0, fs_1.readFileSync)(keypairPath, 'utf8');
            const privateKeyBytes = (0, utils_1.fromBase64)(keypairData.trim());
            keypair = ed25519_1.Ed25519Keypair.fromSecretKey(privateKeyBytes);
        }
        else {
            console.log('🔑 Generating new keypair...');
            keypair = new ed25519_1.Ed25519Keypair();
            const privateKeyB64 = keypair.getSecretKey();
            (0, fs_1.writeFileSync)(keypairPath, privateKeyB64);
            console.log('💾 Keypair saved to .sui-keypair');
        }
        const address = keypair.getPublicKey().toSuiAddress();
        console.log(`👤 Deployer address: ${address}`);
        // Check balance
        const balance = await client.getBalance({ owner: address });
        console.log(`💰 Balance: ${balance.totalBalance} MIST (${parseInt(balance.totalBalance) / 1e9} SUI)`);
        if (parseInt(balance.totalBalance) < 1e8) { // Less than 0.1 SUI
            console.log('⚠️  Low balance detected. You may need to fund your wallet.');
            console.log(`   Get testnet SUI from: https://faucet.testnet.sui.io/`);
            console.log(`   Your address: ${address}`);
        }
        // Read the compiled Move bytecode
        const movePackagePath = process.cwd();
        console.log(`📦 Building Move package from: ${movePackagePath}`);
        // Build the Move package
        try {
            console.log('🔨 Building Move package...');
            (0, child_process_1.execSync)('sui move build', {
                cwd: movePackagePath,
                stdio: 'inherit'
            });
        }
        catch (buildError) {
            console.error('❌ Failed to build Move package:', buildError);
            return;
        }
        // Read the compiled bytecode
        const buildDir = (0, path_1.join)(movePackagePath, 'build', 'rwa_exchange');
        const bytecodeModulesPath = (0, path_1.join)(buildDir, 'bytecode_modules');
        if (!(0, fs_1.existsSync)(bytecodeModulesPath)) {
            console.error('❌ Bytecode modules not found. Make sure the Move package built successfully.');
            return;
        }
        const modules = (0, fs_1.readdirSync)(bytecodeModulesPath)
            .filter((file) => file.endsWith('.mv'))
            .map((file) => {
                const modulePath = (0, path_1.join)(bytecodeModulesPath, file);
                return Array.from((0, fs_1.readFileSync)(modulePath));
            });
        console.log(`📚 Found ${modules.length} compiled modules`);
        // Create deployment transaction
        const tx = new transactions_1.Transaction();
        const [upgradeCap] = tx.publish({
            modules,
            dependencies: ['0x1', '0x2'], // Sui framework dependencies
        });
        // Transfer upgrade capability to deployer
        tx.transferObjects([upgradeCap], tx.pure.address(address));
        // Set gas budget
        tx.setGasBudget(100000000); // 0.1 SUI
        console.log('📤 Submitting deployment transaction...');
        // Execute the transaction
        const result = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
            options: {
                showEffects: true,
                showObjectChanges: true,
                showEvents: true,
            },
        });
        console.log('✅ Deployment successful!');
        console.log(`📋 Transaction digest: ${result.digest}`);
        // Extract package ID from object changes
        const packageId = result.objectChanges?.find(change => change.type === 'published')?.packageId;
        if (packageId) {
            console.log(`📦 Package ID: ${packageId}`);
            // Save deployment info
            const deploymentInfo = {
                network: NETWORK,
                packageId,
                deployerAddress: address,
                transactionDigest: result.digest,
                timestamp: new Date().toISOString(),
                modules: ['property_nft'],
            };
            const deploymentPath = (0, path_1.join)(process.cwd(), 'deployment.json');
            (0, fs_1.writeFileSync)(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
            console.log('💾 Deployment info saved to deployment.json');
            // Update the contract constants in the frontend
            await updateContractConstants(packageId);
            console.log('\n🎉 Deployment completed successfully!');
            console.log(`🔗 View on Sui Explorer: https://suiexplorer.com/object/${packageId}?network=${NETWORK}`);
        }
        else {
            console.error('❌ Could not extract package ID from deployment result');
        }
    }
    catch (error) {
        console.error('❌ Deployment failed:', error);
        process.exit(1);
    }
}
async function updateContractConstants(packageId) {
    console.log('🔄 Updating contract constants in frontend...');
    try {
        // Update the NFT contracts configuration
        const nftContractsPath = (0, path_1.join)(process.cwd(), 'src', 'consts', 'nft_contracts.ts');
        if ((0, fs_1.existsSync)(nftContractsPath)) {
            let content = (0, fs_1.readFileSync)(nftContractsPath, 'utf8');
            // Replace the placeholder package ID
            content = content.replace(/packageId:\s*['"][^'"]*['"]/g, `packageId: '${packageId}'`);
            // Update the address field as well
            content = content.replace(/address:\s*['"][^'"]*['"]/g, `address: '${packageId}'`);
            (0, fs_1.writeFileSync)(nftContractsPath, content);
            console.log('✅ Updated NFT contracts configuration');
        }
        // Create or update environment variables
        const envPath = (0, path_1.join)(process.cwd(), '.env.local');
        let envContent = '';
        if ((0, fs_1.existsSync)(envPath)) {
            envContent = (0, fs_1.readFileSync)(envPath, 'utf8');
        }
        // Update or add the package ID
        if (envContent.includes('NEXT_PUBLIC_RWA_PACKAGE_ID')) {
            envContent = envContent.replace(/NEXT_PUBLIC_RWA_PACKAGE_ID=.*/, `NEXT_PUBLIC_RWA_PACKAGE_ID=${packageId}`);
        }
        else {
            envContent += `\nNEXT_PUBLIC_RWA_PACKAGE_ID=${packageId}\n`;
        }
        (0, fs_1.writeFileSync)(envPath, envContent);
        console.log('✅ Updated environment variables');
    }
    catch (error) {
        console.warn('⚠️  Could not update contract constants:', error);
    }
}
// Run deployment
if (require.main === module) {
    deployContract().catch(console.error);
}
