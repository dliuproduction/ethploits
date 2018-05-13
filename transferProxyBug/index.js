var Web3 = require('web3')
var Web3Utils = require('web3-utils')
const Tx= require('ethereumjs-tx')
var ethereumjsABI = require('ethereumjs-abi')
var utils = require('ethereumjs-util')
var BN = require('bn.js')
var abi = require('./smart_sol_SMART.abi')
var bin = require('./smart_sol_SMART.bin')
  
var contractAddress = "";
var fromAddress = "";
var toAddress = "";
var privateKey = new Buffer("", 'hex');

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

console.log("account: " + fromAddress);

var max = web3.toBigNumber('115792089237316195423570985008687907853269984665640564039457584007913129639935');

var contractInstance = web3.eth.contract(abi).at(contractAddress);

var nonce = parseInt(contractInstance.getNonce(fromAddress));
console.log('nonce: ' + nonce)

var hash = utils.toBuffer("");

console.log("hash: " + utils.bufferToHex(hash));

var sig = utils.ecsign(hash, privateKey);

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