<<<<<<< HEAD
require("@nomicfoundation/hardhat-toolbox");

//import('hardhat/config').HardhatUserConfig 
=======
//antes la version e solidity era 0.8.9
/**
* @type import('hardhat/config').HardhatUserConfig
*/
require("@nomiclabs/hardhat-ethers");
require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config();
const { PRIVATE_KEY } = process.env;
>>>>>>> 5e310e4416be3e58317ede628da710eb5e85b077
module.exports = {
  defaultNetwork: "PolygonMumbai",
  solidity: '0.8.9',
  networks: {
    hardhat: {
    },
    PolygonMumbai : {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [PRIVATE_KEY]
    }
  },
  solidity: {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
}