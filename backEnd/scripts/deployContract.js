const { ethers } = require("hardhat");


async function deployContract() {
    const ExampleNFT = await ethers.getContractFactory("AgreementContract") 
    const exampleNFT = await ExampleNFT.deploy()
    await exampleNFT.deployed()
    const txHash = exampleNFT.deployTransaction.hash
    const txReceipt = await ethers.provider.waitForTransaction(txHash)
    const contractAddress = txReceipt.contractAddress
    console.log("Contract deployed to address:", contractAddress)
   }

   deployContract()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
