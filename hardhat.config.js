require("@unlock-protocol/hardhat-plugin")
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const ALCHEMY_API = `${process.env.ALCHEMY_API_KEY}`;
const PRIVATE_KEY = `${process.env.MUMBAI_PRIVATE_KEY}`;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    goerli: {
      url: ALCHEMY_API,
      accounts: [PRIVATE_KEY]
    }
  }
};
