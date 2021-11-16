import React, { useState, useEffect } from "react";
import { Stack, Input, Box, Button, Heading, Tag } from "degen";
import { Web3Modalfunction } from "../hooks/web3";
import StakingAbi from "../abis/Staking.json";
import uniAbi from "../abis/UNI.json";
import toast, { Toaster } from "react-hot-toast";

const Form = () => {
  const { web3, error, connectWallet, disconnect } = Web3Modalfunction();
  const [approvevalue, setApprooveValue] = useState<string>("");
  const [stakingAmount, setStakingAmount] = useState<string>("");
  const [allowanceAmount, setAllowanceAmount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("");
  const [reward, setReward] = useState<string>("");

  const stakingAddress = "0xAB2C3858c70D96a8339Bf58253381608592574d6";
  const uniAddress = "0xb1E0D95326DC0c70d99080FdA8a6091132708a7e";

  // useEffect(() => {
  //   console.log("hey from form");
  //   const temp = async () => {
  //     if (web3) {
  //       const accounts = await web3.eth.getAccounts();
  //       console.log(accounts);
  //       if (accounts) {
  //         setAccount(accounts[0]);
  //       }
  //       const initContract = new web3.eth.Contract(StakingAbi, stakingAddress);
  //       if (initContract) {
  //         setStakingContract(initContract);
  //       }
  //       console.log(initContract.methods);
  //     }
  //   };
  //   temp();
  // }, [web3]);

  const handleApproove = async () => {
    const loadingToast = toast.loading("Approving..");
    try {
      if (web3) {
        const uniContract = new web3.eth.Contract(uniAbi, uniAddress);
        const accounts = await web3.eth.getAccounts();
        console.log(uniContract.methods);

        const recipt = await uniContract.methods
          .approve(stakingAddress, parseInt(approvevalue))
          .send({
            from: accounts[0],
          });

        const allowance = await uniContract.methods
          .allowance(accounts[0], stakingAddress)
          .call();
        console.log(allowance);
        if (allowance) {
          setAllowanceAmount(allowance);
        }
        toast.success("Approved", {
          id: loadingToast,
        });
      } else {
        await connectWallet();
        toast.error("Something went wrong!", {
          id: loadingToast,
        });
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong", {
        id: loadingToast,
      });
    }
  };

  const handleStake = async () => {
    const loadingToast = toast.loading("Staking...");
    try {
      if (web3) {
        const uniContract = new web3.eth.Contract(uniAbi, uniAddress);
        const accounts = await web3.eth.getAccounts();
        console.log(uniContract.methods);
        const allowance = await uniContract.methods
          .allowance(accounts[0], stakingAddress)
          .call();
        console.log(allowance);
        if (parseInt(stakingAmount) > parseInt(allowance)) {
          toast.error("Staking value can not be more than approve value!", {
            id: loadingToast,
          });
          return;
        }
        console.log("hey");
        const stakingContract = new web3.eth.Contract(
          StakingAbi,
          stakingAddress
        );
        console.log(stakingContract.methods);
        const stakePeriod = await stakingContract.methods
          .getStakingPeriod()
          .call();

        if (parseInt(stakePeriod) < Date.now() / 1000) {
          toast.error("Staking period over", {
            id: loadingToast,
          });
          return;
        }
        const stakereciept = await stakingContract.methods
          .stake(parseInt(stakingAmount))
          .send({
            from: accounts[0],
          });
        if (stakereciept) {
          toast.success("Done", {
            id: loadingToast,
          });
        }
        console.log(stakereciept);
      } else {
        toast.error("Something went wrong!", {
          id: loadingToast,
        });
        await connectWallet();
      }
    } catch (e: any) {
      toast.error("Something went wrong!", {
        id: loadingToast,
      });
      // console.log(e.Error);
    }
  };

  const balanceHandler = async () => {
    try {
      const stakingContract = new web3.eth.Contract(StakingAbi, stakingAddress);
      const accounts = await web3.eth.getAccounts();
      const { balance, reward } = await stakingContract.methods
        .getBalances()
        .call({
          from: accounts[0],
        });
      console.log(balance);
      setBalance(balance);
      setReward(reward);
    } catch (e) {
      console.log(e);
    }
  };

  const handleWithdrawl = async () => {
    const load = toast.loading("Loading..");
    try {
      const accounts = await web3.eth.getAccounts();
      const stakingContract = new web3.eth.Contract(StakingAbi, stakingAddress);

      const stakingPeriod = await stakingContract.methods
        .getStakingPeriod()
        .call();
      console.log(stakingPeriod);
      const date = Date.now();
      console.log(date);
      if (parseInt(stakingPeriod) > date / 1000) {
        toast.error(
          `Staking period not over yet, It will end at ${new Date(
            stakingPeriod * 1000
          )}`,
          {
            id: load,
          }
        );
      } else {
        const reciept = await stakingContract.methods.withdraw().send({
          from: accounts[0],
        });
        if (reciept) {
          toast.success("Success", {
            id: load,
          });
        } else {
          toast.error("Something went wrong", {
            id: load,
          });
        }
      }
    } catch (e) {
      toast.error("Something went wrong", {
        id: load,
      });
      console.log(e);
    }
  };

  return (
    <div style={{ width: "60%", margin: "0 auto", marginTop: "50px" }}>
      <Toaster />
      <Box textAlign="center" marginBottom="10">
        <Heading level="2" color="textSecondary">
          {`Staking Contract Address: ${stakingAddress}`}
        </Heading>
      </Box>
      <Stack>
        <Stack direction="horizontal" justify="space-between" align="center">
          <Input
            label="Amount"
            placeholder="1,2,3,4..."
            description="Amount of UNI token you want to approove for staking contract"
            onChange={(e) => setApprooveValue(e.target.value)}
          />
          <Button
            variant="primary"
            size="small"
            tone="blue"
            onClick={handleApproove}
          >
            Approove
          </Button>
        </Stack>
        {allowanceAmount && (
          <Tag hover>{`Total allowance amount ${allowanceAmount}`}</Tag>
        )}
        <Stack direction="horizontal" justify="space-between" align="center">
          <Input
            label="Staking amount"
            placeholder="10,20,30..."
            description="Amount of UNI token you want to stake."
            onChange={(e) => setStakingAmount(e.target.value)}
          />
          <Button
            variant="primary"
            size="small"
            tone="blue"
            onClick={handleStake}
          >
            Stake
          </Button>
        </Stack>
        <Box marginTop="10">
          <Stack direction="horizontal" justify="space-between">
            <Button variant="primary" size="small" onClick={balanceHandler}>
              Get balance
            </Button>

            {balance && (
              <Box>
                Balance:{balance} UNI{" "}
                <span style={{ marginLeft: "10px" }}>
                  Reward:{reward} $CREATOR
                </span>
              </Box>
            )}
          </Stack>
        </Box>
        <Box marginTop="4">
          <Stack>
            <Button variant="primary" size="small" onClick={handleWithdrawl}>
              Withdrawl
            </Button>
          </Stack>
        </Box>
      </Stack>
    </div>
  );
};

export default Form;
