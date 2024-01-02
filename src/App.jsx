import { useState } from 'react'
import { ethers, Wallet } from 'ethers'

import './App.css'

function App() {

  let CONTRACT_ABI = [
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "text",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Example.Greeting",
                "name": "greeting",
                "type": "tuple"
            },
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint8",
                "name": "v",
                "type": "uint8"
            },
            {
                "internalType": "bytes32",
                "name": "r",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "greet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "greetingSender",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "greetingText",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "text",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Example.Greeting",
                "name": "greeting",
                "type": "tuple"
            },
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint8",
                "name": "v",
                "type": "uint8"
            },
            {
                "internalType": "bytes32",
                "name": "r",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "verify",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
  const [sginer, setSginer] = useState()
  const [provider, setProvider] = useState()
  const [walletAddress, setWalletAddress] = useState()
  const connectMeta = async() => {
    let account;
    let currentChainId;
    if(!window.ethereum){
        alert("Please install MetaMask!")
    }
    await window.ethereum.request({ method:"eth_requestAccounts"})
        .then( (accounts) => {
        account = (accounts[0]);
    }).catch( (e) => {
        alert(e)
    })
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    setWalletAddress(account)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    setProvider(provider)
    setSginer(signer);
    console.log("Wallet connected!")
  }

  const signMsg = async () => {
    // let NETWORK_ID = 1442;
    let NETWORK_ID = 80001;
    let GREETER_CONTRACT_ADDRESS = "0x84D566e7CD4E0B1F52D37d1EC8A988E858b64332";
    let message = "Cool msg from ETH acc"
    let deadline = 1714629932
    const msgParams = JSON.stringify({
      types: {
          EIP712Domain: [
              { name: 'name', type: 'string' },
              { name: 'version', type: 'string' },
              { name: 'chainId', type: 'uint256' },
              { name: 'verifyingContract', type: 'address' },
          ],
          Greeting: [
              { name: 'text', type: 'string' },
              { name: 'deadline', type: 'uint' }
          ],
      },
      primaryType: 'Greeting',
      domain: {
          name: 'Ether Mail',
          version: '1',
          chainId: NETWORK_ID,
          verifyingContract: GREETER_CONTRACT_ADDRESS,
      },
      message: {
          text: message,
          deadline: deadline,
      },
    });
    console.log(msgParams)
  
    const signature = await window.ethereum.request({
      method: "eth_signTypedData_v4",
      params: [walletAddress, msgParams],
    });

    console.log("Signature: " , signature)
  
  }
 
  const makeTx = async() => {

    // let signature = "0x85d5470da125463f466490f11a6200c71a0626448357a086ea2756380caa44a825e33c74aefee528080c1384fe2da42a113fb2491cf19266a718fe148a1687a01b"
    let signature = "0x8f80d44413414b77017f9eb3fdcfc43dfadf336478754833413335054e32315f59f6fde83b2616570a4afbb2989485f2e16e693c42e7b92805d7b6f123725caa1b"
    let greetingText = "Cool msg from ETH acc"
    let greetingDeadline = 1714629932
    let greetingSender = "0x92382c1EC09a72cd4a6bA024C4553a16a2250C2F" // Account 2
    // let greetingSender = "0x068E4E53f661Ac33ef0Cf2e63EbC46cDd8652700" // Account 3
    
    const r = signature.slice(0, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16);
    console.log(v)
    console.log(r)
    console.log(s)

    let GREETER_CONTRACT_ADDRESS = "0x84D566e7CD4E0B1F52D37d1EC8A988E858b64332"
    // let RPC_URL = "https://zkevm-rpc.com";
    let RPC_URL = "https://rpc-mumbai.maticvigil.com";
    let PRIVATE_KEY = "sdjflksdfsl" // 2
    
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const signer = new Wallet(PRIVATE_KEY, provider);
    let contractInstance = new ethers.Contract(GREETER_CONTRACT_ADDRESS, CONTRACT_ABI, signer);


    const unsignedTrx = await contractInstance.populateTransaction.greet(
      ["Cool msg from ETH acc",1714629932],
      "0x76Ae1122e702f22827cd3246370f796B666634DB", // This address is of users who signed the message.
      27, // V
      "0x8f80d44413414b77017f9eb3fdcfc43dfadf336478754833413335054e32315f", // R 
      "0x59f6fde83b2616570a4afbb2989485f2e16e693c42e7b92805d7b6f123725caa", // S
    );
    console.log('Transaction created');

    const trxResponse = await signer.sendTransaction(unsignedTrx);
    console.log("trxResponse", trxResponse)

    console.log("Message sent!")
  }

return (
    <>
      <h2>App.js </h2>
      <br />
      <button onClick={connectMeta}>Connect Meta</button>
      <br />
      <br />
      <button onClick={signMsg}>Sign Msg</button>
      <br />
      <br />
      <button onClick={makeTx}>Make Tx</button>
    </>
  )
}

export default App
