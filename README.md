This is an example activity that shows how a user can interact with a smart contract through a webpage and nodejs server. NOTE: This is **not** production ready code!

# Introduction

In this folder you will find a [nodejs server](https://github.com/Luker501/WebpageToSCInteraction/blob/master/server.js) that allows a interaction between a user and an ERC-20 smart contract deployed on the Ethereum Ropsten testnet, via a simple [webpage](https://github.com/Luker501/WebpageToSCInteraction/blob/master/views/index.ejs).

# Initial Setup

## Installing the required components

You will need to install [nodejs](https://nodejs.org/en/). Afterwards clone this folder and use `npm install` (npm comes installed with nodejs) to add the required packages stated in the first 8 lines of [server.js](https://github.com/Luker501/WebpageToSCInteraction/blob/master/server.js). See [here](https://docs.npmjs.com/cli/install) for npm instructions if you are unfamilar with it.

## Making the required server changes

You are now nearly ready to run the server. Before you do so, make sure to complete the configuration of the code in the server.js file by replacing all sections marked `[...]` with real code.

**WARNING** - Sharing code with your private key in makes your account vunerable. It is strongly advised to just create a test account for this activity and fund it with a small amount of Ropsten Ether only. Note that Ethereum will use the same address/private key pair for all Ethereum networks (Mainnet,Ropsten,Rinkeby,...) so revealing a private key when working with one network reveals the private key for all Ethereum networks.

### Generating a test account

To easily generate a test Ethereum account go to [this website](https://vanity-eth.tk/), click on the generate button and reveal the private key.

**WARNING** - If you are intending to use an Ethereum account for important activity (e.g. holding real Ether), make sure you thoroughly check the Ethereum account generation method you have decided to use. I am only recommending to use the above linked website for Ethereum accounts on a TEST network. I will hold no liability for any use of these accounts on the Ethereum mainnet.

### Funding your test account

To fund an account on a test network, we can use faucets. Ropsten has a few faucets that can fund your address, such as the one [here](https://faucet.metamask.io/) or [here](https://faucet.ropsten.be/).

# Running the App

Once you have performed the initial setup, use node to start your server by opening a terminal/command prompt in the same folder and typing the following into the console:

```
node server.js
```
You will see `Example app listening on port 3000!` printed in the console. Now open your web browser and go to `http://localhost:3000/` where you will see a simple webpage displayed like so:

![Initial Webpage](webpagePics/webpage.png)

We can now trigger a smart contract state query function by entering an address and clicking on the 'get balance of address' button in the webpage. Clicking on this button triggers `app.post('/balance',...` in the server. When the call returns, you will see the current address token balance, like so:

![Webpage with Winning Vote](webpagePics/addressBalance.png)

Lastly we can trigger a smart contract state change function by entering an address and token value to sendand then clicking on the 'Send tokens' button in the webpage. Clicking on this button triggers `app.post('/',...` in the server, which builds a new blockchain transaction and sends it to the node. When the call returns, you will see the corresponding transaction hash, like so:

![Webpage with a New Vote Transaction](webpagePics/transactionHash.png)


# Credits

This activity builds on:

https://medium.com/@codetractio/try-out-ethereum-using-only-nodejs-and-npm-eabaaaf97c80
