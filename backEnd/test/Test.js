const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe('MySmartContract', function () {
    before(async function(){//deployment
        [owner,addr1,addr2] = await ethers.getSigners();
        Token = await ethers.getContractFactory("AgreementContract",owner);
        hardhatToken = await Token.deploy();
        hardhatToken.deployed();

        Token2 = await ethers.getContractFactory("Arbitrator",owner);
        hardhatToken2 = await Token2.deploy();
        hardhatToken2.deployed();
        txHash2 =await hardhatToken2.deployTransaction.hash;
        txReceipt2 = await ethers.provider.waitForTransaction(txHash2);
        contractAddress2 = txReceipt2.contractAddress;

        await hardhatToken.connect(owner).setArbitrator(contractAddress2);

     } )

    it('Users should be able to create an agreement and it should be added to the map', async function () {
        const [owner,addr1] = await ethers.getSigners();
        const id = await hardhatToken.connect(addr1).createAgreement(ethers.utils.parseEther("0.5"));
        const ids = await hardhatToken.connect(addr1).getAgreements();
        expect(JSON.stringify(ids)==JSON.stringify([0]));

    });

    it('Client should be able to sign and pay agreements', async function(){
        const [owner,addr1, addr2] = await ethers.getSigners();
        await hardhatToken.connect(addr2).signAgreement(0,{
            value: ethers.utils.parseEther("0.5")
        });
        const bal = await hardhatToken.connect(owner).getContractBalance();
        
        expect(bal== ethers.utils.parseEther("0.5"));
    })

    it('Clients should be able to advance checkpoint',async function(){ 

    
        const[owner,addr1,addr2] = await ethers.getSigners();
        await hardhatToken.connect(addr1).checkpointProvider(0);
        expect(await hardhatToken.connect(owner).getAgreementStatus(0)==0);

        await hardhatToken.connect(addr2).checkpointBuyer(0);
        expect(await hardhatToken.connect(owner).getAgreementStatus(0)==1);

        await hardhatToken.connect(addr1).checkpointProvider(0);
        expect(await hardhatToken.connect(owner).getAgreementStatus(0)==1);

        await hardhatToken.connect(addr2).checkpointBuyer(0);
        expect(await hardhatToken.connect(owner).getAgreementStatus(0)==2);

    })

    it('Buyer should be able to raise a dispute', async function(){ 
        const[owner,addr1,addr2] = await ethers.getSigners();
        hardhatToken.connect(addr2).reclaimFunds(0,{
            value: ethers.utils.parseEther("0.1")
        });

        await hardhatToken2.connect(owner).rule(0,1);
        hardhatToken.connect(addr2).claim(0);

        const bal = await hardhatToken.connect(owner).getContractBalance();
        
        expect(bal== 0);


        

        

    })
  });
  
  
  
  
  