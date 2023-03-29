const main = async () => {
  //get smart contract
  const transactionsFactory = await hre.ethers.getContractFactory(
    "Transactions"
  );

  //deploy smart contract
  //deploy() trigger this deployment of the contract
  //deployed() checks if the contract is already available on the blockchain and if the deployment is still ongoing will wait for the deployment transaction to be mined
  const transactionsContract = await transactionsFactory.deploy();
  await transactionsContract.deployed();

  console.log("Transactions address: ", transactionsContract.address);
};

// run-main() function
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();

// Also use this way
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
