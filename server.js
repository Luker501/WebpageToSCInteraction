//generic imports for the nodejs server:
const express = require('express');
const bodyParser = require('body-parser');
const app = express()
	//Ethereum specific imports:
let Web3 = require('web3');
let tx = require('ethereumjs-tx').Transaction;
let lightwallet = require('eth-lightwallet');
let txutils = lightwallet.txutils;

//***Put your Ethereum account address here (in quotes)***:
let yourAddress = "[...]";
//***Put your Ethereum account private key here (in quotes)***:
let yourKey = "[...]"; //NOTE IF YOU SHARE THIS CODE WITH ANYONE YOUR ACCOUNT IS VUNERABLE - PLEASE ONLY USE A TEST ACCOUNT
//***Put the Ethereum contract address to interact with here (in quotes)***:
let yourERC20ContractAddress = "[...]";   // - make sure the contract is deployed on the Ropsten testnet
//***Put your personal Infura end point address here***:
let yourInfuraEndPointKey = "[...]"; 
//***Put the Solidity contract ABI interface of your ERC-20 contract here (Remix provides it as an array)***: 
let yourERC20Contractinterface = [...];

//the following code sets up the server:
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

//the following code sets the server to listen at http://localhost:3000/
app.listen(3000, function () {

	console.log('Example app listening on port 3000!')

})

//when the user loads http://localhost:3000/ in the browser, the following code is run that returns the webpage ./views/index.ejs:
app.get('/', function (req, res) {

	console.log('Loading generic webpage');
	res.render('index', {balanceIs: null, info: null});  //this line passes through two parameters to the embedded javascript template (ejs), both initialised as null

})

//When the user clicks on the 'get balance of address' button of the webpage, the following code is run that returns a new version of the webpage, which includes information on the token balance (of the smart contract) of the provided address
app.post('/balance', function (req, res) {

	console.log('Getting balance to display on webpage for address: ' + req.body.address);
	if (typeof req.body.address != 'undefined'){
		//now lets nominate our provider for the blockchain interaction functionality:	
		const web3 = new Web3(
			//we will use the infura servers connected to the Ropsten Ethereum testnet
	    		new Web3.providers.HttpProvider('https://ropsten.infura.io/' + yourInfuraEndPointKey)
		);

		//now lets load the interface of the smart contract (first parameter) and connect to the particular instance of this smart contract (second parameter).	
		const contract = new web3.eth.Contract(yourERC20Contractinterface, yourERC20ContractAddress);
		//***to get the balance of the address from the smart contract, what function do we have to call? Replace [...] with the function name (NO quotes)
		contract.methods.[...](req.body.address).call(function(err, result) {
			if(err) {
				//if there was an error when calling the function do the following:
				console.log("error when calling the smart contract function: " + err);
				//so lets inform the user via the user interface:
				res.render('index', {balanceIs: null, info: err});
		    	} else {
				//if the function call proceeded correctly do the following:
				console.log("the contract function returned: " + result);
				//so lets inform the user of this via the user interface:	  	
				res.render('index', {balanceIs: 'The balance of address ' + req.body.address + ' is: ' + result, info: null});
		    	}
		});
	} else {
		res.render('index', {balanceIs: null, info: 'toAddress or value is not undefined'});
	}
})

//When the user clicks on the 'Send tokens' button of the webpage, the following code is run that returns a new version of the webpage, which includes the transaction hash that has been sent to the blockchain to perform the desired request. 
app.post('/', async function (req, res) {
		
	console.log('Post occurred with (toAddress): ' + req.body.address);
	console.log('Post occurred with (value): ' + req.body.value);
	
	if ((typeof req.body.address != 'undefined')||(typeof req.body.value != 'undefined')){
		//again we nominate our provider for the blockchain interaction functionality:
		var web3 = new Web3(
			//again we will use the infura servers connected to the Ropsten Ethereum testnet
  			new Web3.providers.HttpProvider('https://ropsten.infura.io/' + yourInfuraEndPointKey)
		);	
		//now we build the Ethereum transaction, starting with the options.
			//As Ethereum is an accounts based blockchain, we will need to get the address nonce value (used to order transactions being sent from this address):
		let txCount = await web3.eth.getTransactionCount(yourAddress);
		console.log("txCount: " + txCount);
			//Now we can build the transactions options object
		var txOptions = {
			//***what value should be passed to this function to get the hexadecimal value of the transaction nonce?
			nonce: web3.utils.toHex([...]),
			//Gas Price - Cost of executing each unit of gas. GasPrice is in Wei
			gasPrice: web3.utils.toHex(20000000000),			
			//Gas Limit - a limit on the total gas units your transaction can perform. 
			gasLimit: web3.utils.toHex(800000),	
			//of course this transaction is being sent to your contract address
			to: yourERC20ContractAddress
		}
		console.log("Your transaction options: " + JSON.stringify(txOptions));
		//now lets build the whole transaction. 
		//***To do so we have: (a) the contract interface; (b) followed by the function name (in quotes); (c) an array of the function arguments; and (d) the transaction options. You need to fill-in part (b) by choosing which is the correct function from the smart contract, and part (c) by choosing the correct two parameters to pass in, in the right order. 
		var rawTx = txutils.functionTx(yourERC20Contractinterface, "[...]" , [[...],[...]], txOptions);
		//its time to sign the transaction. Note that this is occuring before the transaction has been sent to the provider.		
		console.log('signing transaction');
		var privateKey = new Buffer(yourKey, 'hex');
		var transaction = new tx(rawTx, {'chain':'ropsten'});
		//***what parameter should the transaction be signed with?
		transaction.sign([...]);
		
		//ok we have the signed transaction, so lets send it
		console.log('signing transaction');
			//before sending the transaction it needs to be serialised into hex format
		var serializedTx = transaction.serialize().toString('hex');
		web3.eth.sendSignedTransaction('0x' + serializedTx, function(err, result) {
			if(err) {
				//if there was an error when calling the function do the following:
				console.log("error when sending the transaction: " + err);
				//so lets inform the user via the user interface:
				res.render('index', {balanceIs: null, info: err});
			} else {
				//if the function call proceeded correctly do the following:	
				console.log("transaction hash: " + result);
				//load the page back for the user -> you will be given the transaction hash - but remember the transaction remains unconfirmed until it enters a block. So you will now have to wait for the transaction to be mined - this can be checked via Etherscan
				res.render('index', {balanceIs: null, info: "transaction hash: " + result});	
			}
		});
        
	} else {
		console.log('toAddress or value is not defined');
		res.render('index', {balanceIs: null, info: 'toAddress or value is not undefined'});	
	}
})
