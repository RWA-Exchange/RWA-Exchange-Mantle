"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
describe("Fractionalizer", function () {
    let propertyNFT;
    let fractionalizer;
    let owner, addr1;
    beforeEach(async function () {
        [owner, addr1] = await hardhat_1.ethers.getSigners();
        // Deploy PropertyNFT
        const PropertyNFT = await hardhat_1.ethers.getContractFactory("PropertyNFT");
        propertyNFT = await PropertyNFT.deploy(owner.address);
        await propertyNFT.waitForDeployment();
        // Deploy Fractionalizer
        const Fractionalizer = await hardhat_1.ethers.getContractFactory("Fractionalizer");
        fractionalizer = await Fractionalizer.deploy(await propertyNFT.getAddress());
        await fractionalizer.waitForDeployment();
    });
    it("Should fractionalize an NFT and redeem it", async function () {
        // Mint a new PropertyNFT
        await propertyNFT.mint(owner.address, "ipfs://some-uri");
        const tokenId = 0;
        // Approve the Fractionalizer to take the NFT
        await propertyNFT.approve(await fractionalizer.getAddress(), tokenId);
        // Fractionalize the NFT
        const totalFractions = 1000;
        await fractionalizer.fractionalize(tokenId, totalFractions, "Fractionalized NFT", "FNFT");
        // Check that the Fractionalizer now owns the NFT
        (0, chai_1.expect)(await propertyNFT.ownerOf(tokenId)).to.equal(await fractionalizer.getAddress());
        // Get the fraction token contract
        const fnft = await fractionalizer.fractionalizedNFTs(tokenId);
        const fractionToken = await hardhat_1.ethers.getContractAt("Fraction", fnft.fractionToken);
        // Check that the owner has the fractions
        (0, chai_1.expect)(await fractionToken.balanceOf(owner.address)).to.equal(totalFractions);
        // Approve the Fractionalizer to spend the fractions for redemption
        await fractionToken.approve(await fractionalizer.getAddress(), totalFractions);
        // Redeem the NFT
        await fractionalizer.redeem(tokenId);
        // Check that the owner now has the NFT back
        (0, chai_1.expect)(await propertyNFT.ownerOf(tokenId)).to.equal(owner.address);
    });
});
