import { ethers } from "ethers";
import { useEffect, useState } from "react";
import './App.css';

const useMetamask = () => {
  const [metamask,setMetamask] = useState();

  useEffect(() => {

  })
}

function App() {
  const [block,setBlock] = useState();

  useEffect(() => {
    const connectToMetamask = async() => {

      // TODO: Change this to add etherum to global window object
      // @ts-ignore
      const provider = new ethers.providers.Web3Provider(window?.ethereum)
      let accounts
      // const provider = new ethers.providers.Web3Provider(window.ethereum)
      try {
        accounts = await provider.send("eth_requestAccounts", []);
      } catch(error) {
        console.log(error)
        alert('FAILED TO CONNECT TO WALLET')
      }
      const balance = await provider.getBalance(accounts[0]);
      const block = await provider.getBlockNumber();
      console.log('last block ', block)
      debugger;
      // provider.on("block", (block) => {
      //   setBlock(block)
      //   console.log('block numer:', block)
      // })
    }
    connectToMetamask();
    
  })

  // const connectToMetamask = async() => {
  //   //@ts-ignore
  //   const provider = new ethers.providers.Web3Provider(window?.ethereum)
  //   console.log('provider')

  //   const block = await provider.getBlockNumber();
  //   console.log('last block ', block)
  //   provider.on("block", (block) => {
  //     setBlock(block)
  //     console.log('block numer:', block)
  //   })
  //   console.log(provider)

  // }

  return (
    <div className="App">
      <div >connnnect ro</div>
    </div>
  );
}

export default App;
