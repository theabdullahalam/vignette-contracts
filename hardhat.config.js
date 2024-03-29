require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

const { MNEMONIC, INFURA_KEY } = process.env

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: 'rinkeby',
  networks: {
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
    ganache: {
      url: `http://0.0.0.0:8545/`,
      chainId: 1337,
      accounts: {
        mnemonic: MNEMONIC,
      }
    }
  },
};
