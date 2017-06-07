import { BunqKey, BunqApi, BunqApiConfig, BunqApiSetup, BunqServerConnection, SessionCreator } from 'bunq-api/dist/index';
const fs = require('file-system');

const Web3 = require('web3');

const web3 = new Web3();
const provider = new web3.providers.HttpProvider('http://192.168.0.7:8545');
web3.setProvider(provider);
const shh = web3.shh;

var coinbase:string = web3.eth.coinbase;

console.log(coinbase+" is an address: "+web3.isAddress(coinbase));

var balance = web3.eth.getBalance(coinbase);
console.log("balance: "+balance.toString(10));

console.log("connected:"+web3.isConnected());
console.log("client is listening: "+web3.net.listening);
console.log("peers: "+web3.net.peerCount);

const config:any = BunqApiConfig.readJson("server.json");
const serverWhisperId = config.whisperId;
const myIdentity = shh.newIdentity();
console.log("whisperId of sender: "+myIdentity);

const payload = 'hello whisper world!';

var message = {
    from: myIdentity,
    to:serverWhisperId,
    topics: ["CoF"],
    payload: payload,
    ttl: 100,
    workToProve: 100 // or priority TODO
};

console.log("send msg: "+JSON.stringify(message));

shh.post(message);