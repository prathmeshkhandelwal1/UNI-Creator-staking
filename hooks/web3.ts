import Web3modal from "web3modal";
import Web3 from "web3";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import WalletConnectProvider from "@walletconnect/web3-provider";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
    },
  },
};

let web3Modal: any;

export function Web3Modalfunction() {
  const [web3, setWeb3] = useState<null | any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    web3Modal = new Web3modal({
      network: "ropsten",
      cacheProvider: true,
      providerOptions,
    });
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  let loadingToast: any;

  async function connectWallet() {
    try {
      loadingToast = toast.loading("Wallet Connecting...");
      const externalProvider = await web3Modal.connect();
      const web3init = new Web3(externalProvider);
      toast.success("Wallet Connected", {
        id: loadingToast,
      });
      setWeb3(web3init);
    } catch (e) {
      setError("Wallet connection failed");
      console.log(e);
      toast.dismiss(loadingToast);
    }
  }
  function disconnect() {
    try {
      toast.success("Wallet dissconnected");
      web3Modal.clearCachedProvider();
      setWeb3(null);
    } catch (e) {
      console.log(e);
    }
  }
  return { web3, error, connectWallet, disconnect };
}
