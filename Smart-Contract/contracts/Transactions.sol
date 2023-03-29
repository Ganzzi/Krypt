// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Transactions {
    // initial a variable count for transaction fulfilled
    uint256 transactionCount;

    // initial event
    event Transfer(
        address from,
        address receiver,
        uint amount,
        string message,
        uint256 timestamp,
        string keywork
    );

    // create a struct type *like object
    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    // initial an array transactions
    // TransferStruct is a type while transactions is an array
    TransferStruct[] transactions;

    // function to add a transaction to array transactions
    function addToBlockchain(
        address payable receiver,
        uint amount,
        string memory message,
        string memory keyword
    ) public {
        transactionCount += 1;
        transactions.push(
            TransferStruct(
                msg.sender,
                receiver,
                amount,
                message,
                block.timestamp,
                keyword
            )
        );

        // emit event when add transaction to array successfully
        emit Transfer(
            msg.sender,
            receiver,
            amount,
            message,
            block.timestamp,
            keyword
        );
    }

    // function return an array of all transaction fulfilled
    function getAllTransactions()
        public
        view
        returns (TransferStruct[] memory)
    {
        return transactions;
    }

    // function to get the number of transaction fulfilled
    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}
