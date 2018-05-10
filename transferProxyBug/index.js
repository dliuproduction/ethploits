var Web3 = require('web3')
var Web3Utils = require('web3-utils')
const Tx= require('ethereumjs-tx')
var ethereumjsABI = require('ethereumjs-abi')
var utils = require('ethereumjs-util')
var BN = require('bn.js')
var abi = require('./smart_sol_SMART.abi')
var bin = require('./smart_sol_SMART.bin')
  
var contractAddress = "0x60BE37DAcb94748A12208a7Ff298F6112365E31F";
var fromAddress = "0x63aa50612b2f4b8c27d63f3276c0407381a3d193";
var toAddress = "0x975b026c823b7669d22D29820A98FF25c5aC6B83";
var privateKey = new Buffer("6705d988d92a7a9c334af11a36cf0c2e7128328fa41d93c39552fbcc83d017be", 'hex');

// var web3 = new Web3(new Web3.providers.HttpProvider(
//   "https://ropsten.infura.io/<REDACTED API KEY"));

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// web3.eth.defaultAccount = accountAddress;
// var fromAddress = web3.eth.accounts[0].toString();
console.log("account: " + fromAddress);

var max = web3.toBigNumber('115792089237316195423570985008687907853269984665640564039457584007913129639935');
// var max = new BN('115792089237316195423570985008687907853269984665640564039457584007913129639935');

var contractInstance = web3.eth.contract(abi).at(contractAddress);

var nonce = parseInt(contractInstance.getNonce(fromAddress));
console.log('nonce: ' + nonce)
// contractInstance.getNonce({_addr: fromAddress)}.call({ from: contractAddress }, function (error, nonce) {
// web3.eth.getTransactionCount(contractAddress, function (err, nonce) {

// var hash1 = utils.sha3([fromAddress, toAddress, max, 1, nonce]);
var hash = utils.toBuffer("0xaf665da08eeca6958cb62fef949497c4a12e1faacf649a1b6420afc308aa9456");
// var hash = Web3Utils.soliditySha3(fromAddress, toAddress, max, 1, nonce);
// var hashOut = utils.bufferToHex(hash1);
// console.log("hash: " + hashOut);
console.log("hash: " + utils.bufferToHex(hash));


// var hashBuf = new Buffer(hash1, 'hex');
// console.log("hashBuf: " + hash1);

var sig = utils.ecsign(hash, privateKey);
// var signature = web3.eth.sign(fromAddress, hash);
// console.log(sig)
// var r = signature.substr(0, 66);
// var s = '0x' + signature.substr(66, 64);
// var v = web3.toDecimal(signature.substr(130, 2)) + 27;

// // // var data = contractInstance.transferProxy.getData(fromAddress, toAddress, max, 1, v, r, s);
// console.log('v: ' + v);
// console.log('r: ' + r);
// console.log('s: ' + s);


var pubBuf = utils.ecrecover(hash, sig.v, sig.r, sig.s);
const pub = utils.bufferToHex(pubBuf)
var pubkey = utils.privateToPublic(privateKey).toString('hex');

var r = utils.bufferToHex(sig.r);
var s = utils.bufferToHex(sig.s);
console.log("v: " + sig.v);
console.log("r: " + utils.bufferToHex(sig.r));
console.log("s: " + utils.bufferToHex(sig.s));
console.log(pub);
console.log(pubkey);
console.log(utils.bufferToHex(utils.pubToAddress(pub)));

// // const pubKey = utils.ecrecover(hashBuf, res.v, res.r, res.s);
// // console.log(pubKey);
// web3.eth.getTransactionCount(fromAddress, function (err, nonce) {
//   var data = contractInstance.transferProxy.getData(fromAddress, toAddress, max, 1, sig.v, r, s);

//   var rawTx = {
//     nonce: nonce,
//     gasPrice: web3.toHex(web3.toWei('20', 'gwei')),
//     gasLimit: 10000,
//     to: contractAddress,
//     value: 0,
//     data: data
//   };

//   var tx = new Tx(rawTx);
//   tx.sign(privateKey);

//   var raw = '0x' + tx.serialize().toString('hex');
//   web3.eth.sendRawTransaction(raw, function (err, transactionHash) {
//     console.log(transactionHash);
//   });
// });

// contractInstance.transferProxy(fromAddress, toAddress, max, 1, v, r, s, {
//   value:0,
//   gasPrice: web3.toHex(web3.toWei('20', 'gwei')),
//   gasLimit: 10000
// }, function (error, result){
//   if (!error) {
//     console.log(result)
//   }
// });
// 000000000000000000000000000008687907853269984665640564039457584007913129639935
// 115792089237316195423570985000000000000000000000000000000000000000000000000000
// nonce 0:
// "0x63aa50612b2f4b8c27d63f3276c0407381a3d193", "0x975b026c823b7669d22D29820A98FF25c5aC6B83", 115792089237316195423570985008687907853269984665640564039457584007913129639935, 1, 27, "0x658c5dcc1c146ca6acf89307bd6de813f46c428e65e81bf9a928d02a8dff3057", "0x39a1aae41d4f81b405394b713dc34d00d5424986f259122e687b77b6afae988a"