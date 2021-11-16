import { Web3Modalfunction } from "../hooks/web3";
import React, { useState, useEffect } from "react";
import { Stack, Button, IconLockClosed } from "degen";

const ConnectWallet = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { web3, error, connectWallet, disconnect } = Web3Modalfunction();
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (web3) {
      setIsConnected(true);
      const userDetails = async () => {
        const address = await web3.eth.getAccounts();
        console.log(address);
        setAddress(address[0]);
      };
      userDetails();
    } else {
      setIsConnected(false);
    }
  }, [web3]);

  const connectHandler = async () => {
    console.log("handle triogger");
    await connectWallet();
  };

  const disconnectHandler = () => {
    disconnect();
  };
  console.log(isConnected);
  return (
    <div onClick={isConnected ? disconnectHandler : connectHandler}>
      <Stack align="center">
        <Button
          prefix={!isConnected && <IconLockClosed />}
          variant="highlight"
          width={{ xs: "full", md: "max" }}
        >
          {isConnected ? "Disconnect" : `Connect Wallet`}
        </Button>
      </Stack>
    </div>
  );
};

export default ConnectWallet;
