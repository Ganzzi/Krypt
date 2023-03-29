require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/kT67sdKHJLRGgNwMnRfIZ3eCX2b5ghPh",
      accounts: [
        "d58ff7303817b2f2655e39165d6b7e2e0fba3c8c2674ea9ba148bf75c522357b",
      ],
    },
  },
};
