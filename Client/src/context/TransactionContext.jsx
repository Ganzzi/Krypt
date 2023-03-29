import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constant";

export const TransactionContext = React.createContext(); // create context

const { ethereum } = window; // ethereum from window

// function to get contract from backend
const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  //get contract
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  // Use State
  const [formData, setformData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);

  // name is addressTo, amount, keyword and message
  // e: event
  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  // function to get all of Transaction
  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = getEthereumContract();

        const availableTransactions =
          await transactionsContract.getAllTransactions();

        // get a Structured Transaction from available transactions
        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              transaction.timestamp.toNumber() * 1000
            ).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount._hex) / 10 ** 18, // parse to ETH
          })
        );

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // function to check if already connected
  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" }); // get present account
      console.log(accounts);

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // function check transaction
  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = getEthereumContract();
        const currentTransactionCount =
          await transactionsContract.getTransactionCount();

        window.localStorage.setItem(
          "transactionCount",
          currentTransactionCount
        );
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  // function to connect wallet
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  //function to send transaction (transer money)
  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = getEthereumContract();

        const parsedAmount = ethers.utils.parseEther(amount); //parse into wei
        //amount: 0.0005, parsed: 500000000000000 and ._hex: 0x01c6bf52634000

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: addressTo,
              gas: "0x5208", // convert: 0x5208 = 21000Gwei
              value: parsedAmount._hex, //parse into hex
            },
          ],
        });

        // get addToBlockchain()
        const transactionHash = await transactionsContract.addToBlockchain(
          addressTo,
          parsedAmount,
          message,
          keyword
        );

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait(); //wait transaction to be finished
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        // get number of transactions
        const transactionsCount =
          await transactionsContract.getTransactionCount();

        setTransactionCount(transactionsCount.toNumber());

        window.location.reload(); //reload when finish transaction
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object!");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]); //change everytime have one more transaction

  return (
    // pass value in side of {{}} to export to welcome.jsx
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setformData,
        handleChange,
        sendTransaction,
        isLoading,
        transactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
