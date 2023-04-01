const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe('MySmartContract', function () {
    before(async function(){//deployment
        [owner,addr1,addr2] = await ethers.getSigners();
        Token = await ethers.getContractFactory("Agreement",owner);
        hardhatToken = await Token.deploy();
        hardhatToken.deployed();
     } )

    it('Users should be able to create an agreement and it should be added to the map', async function () {
        const [owner,addr1] = await ethers.getSigners();
        const id = await hardhatToken.createAgreement(ethers.utils.parseEther("0.5"));
        const ids = await hardhatToken.connect(addr1).getAgreements();
        expect(JSON.stringify(ids)==JSON.stringify([0]));

    });

    it('Client should be able to sign and pay agreements', async function(){
        const [owner,addr1, addr2] = await ethers.getSigners();
    })
  });
  
  
  
  
  