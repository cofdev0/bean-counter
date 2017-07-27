

// var TestRPC = require("ethereumjs-testrpc");


// Connect to local Ethereum node
// const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8444"));
// const web3 = new Web3();
// web3.setProvider(TestRPC.provider());

// Compile the source code
// const input = fs.readFileSync('token.sol');
// const output = solc.compile(input.toString(), 1);
// const bytecode = output.contracts[':Token'].bytecode;
// const abi = JSON.parse(output.contracts[':Token'].interface);
//
// // Contract object
// const contract = web3.eth.contract(abi);

describe('Token',()=>{

    const solc = require('solc');
    // const fs = require('fs');
    // const Web3 = require('web3');

    test('this test will not run', () => {
        expect('A').toBe('A');
    });

    // it('passes test',()=>{
    //
    //     // Deploy contract instance
    //     web3.eth.getCoinbase((err, coinbase)=>{
    //         const contractInstance = contract.new({
    //             data: '0x' + bytecode,
    //             from: coinbase,
    //             gas: 90000*2
    //         }, (err, res) => {
    //             if (err) {
    //                 console.log(err);
    //                 return;
    //             }
    //
    //             // Log the tx, you can explore status with eth.getTransaction()
    //             console.log(res.transactionHash);
    //
    //             // If we have an address property, the contract was deployed
    //             if (res.address) {
    //                 console.log('Contract address: ' + res.address);
    //                 // Let's test the deployed contract
    //                 testContract(res.address,coinbase);
    //             }
    //         });
    //     });
    //
    // });

});



// Quick test the contract

// function testContract(address,coinbase) {
//     // Reference to the deployed contract
//     const token = contract.at(address);
//     // Destination account for test
//     const dest_account = '0x002D61B362ead60A632c0e6B43fCff4A7a259285';
//
//     // Assert initial account balance, should be 100000
//     token.balances.call(coinbase, (err, balance1) => {
//         if(err) {console.log('balance1 error'); return; }
//         console.log('balance1 == 1000000: '+balance1);
//         expect(balance1).toEqual('1000000');
//     });
//
//
//     // Call the transfer function
//     token.transfer(dest_account, 100, {from: coinbase}, (err, res) => {
//         // Log transaction, in case you want to explore
//         console.log('tx: ' + res);
//         // Assert destination account balance, should be 100
//         token.balances.call(dest_account,(err,balance2)=>{
//             if(err) {console.log('balance2 error'); return; }
//             console.log('balance2 == 100: '+balance2);
//             expect(balance2).toEqual('1000');
//         });
//
//     });
// }
