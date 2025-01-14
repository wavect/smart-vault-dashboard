import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ethers } from "ethers";
import { parseUnits, formatUnits } from "viem";

import {
  useVaultAddressStore,
  useCircularProgressStore,
  useSnackBarStore,
  useGreyProgressBarValuesStore,
  useSmartVaultABIStore,
} from "../../../store/Store";

import Button from "../../../components/Button";

interface WithdrawProps {
  symbol: string;
  tokenAddress: string;
  decimals: number;
  token: any;
  collateralValue: any;
  collateralSymbol: string;
}

const Withdraw: React.FC<WithdrawProps> = ({
  symbol,
  decimals,
  collateralValue,
  collateralSymbol,
}) => {
  const [amount, setAmount] = useState<any>(0);
  const { address } = useAccount();
  const { vaultAddress } = useVaultAddressStore();
  const { smartVaultABI } = useSmartVaultABIStore();
  const { getGreyBarUserInput, getSymbolForGreyBar } =
    useGreyProgressBarValuesStore();
  const inputRef: any = useRef<HTMLInputElement>(null);
  const [txdata, setTxdata] = useState<any>(null);

  const handleAmount = (e: any) => {
    setAmount(parseUnits(e.target.value.toString(), decimals))
    getSymbolForGreyBar(symbol);
    getGreyBarUserInput(formatUnits(parseUnits(e.target.value.toString(), decimals), decimals));
  };

  //snackbar config
  const { getSnackBar } = useSnackBarStore();

  const { getCircularProgress, getProgressType } = useCircularProgressStore();

  const { writeContract, isError, isPending, isSuccess } = useWriteContract();

  const handlewithdrawCollateralNative = async () => {
    try {
      writeContract({
        abi: smartVaultABI,
        address: vaultAddress as any,
        functionName: "removeCollateralNative",
        args: [
          amount,
          address as any
        ],
      });

    } catch (error: any) {
      let errorMessage: any = '';
      if (error && error.shortMessage) {
        errorMessage = error.shortMessage;
      }
      getSnackBar('ERROR', errorMessage);
    }
  };

  const handlewithdrawCollateral = async () => {
    try {
      writeContract({
        abi: smartVaultABI,
        address: vaultAddress as any,
        functionName: "removeCollateral",
        args: [
          ethers.utils.formatBytes32String(symbol),
          amount,
          address as any
        ],
      });

    } catch (error: any) {
      let errorMessage: any = '';
      if (error && error.shortMessage) {
        errorMessage = error.shortMessage;
      }
      getSnackBar('ERROR', errorMessage);
    }
  };

  useEffect(() => {
    if (isPending) {
      getProgressType(1);
      getCircularProgress(true);
    } else if (isSuccess) {
      getSnackBar('SUCCESS', 'Success!');
      getCircularProgress(false); // Set getCircularProgress to false after the transaction is mined
      inputRef.current.value = "";
      inputRef.current.focus();
      getGreyBarUserInput(0);
      setTxdata(txRcptData);
    } else if (isError) {
      inputRef.current.value = "";
      inputRef.current.focus();
      getCircularProgress(false); // Set getCircularProgress to false if there's an error
      getGreyBarUserInput(0);
    }
  }, [
    isPending,
    isSuccess,
    isError,
  ]);

  const shortenAddress = (address: any) => {
    const prefix = address?.slice(0, 6);
    const suffix = address?.slice(-8);
    return `${prefix}...${suffix}`;
  };

  const shortenedAddress = shortenAddress(address);

  const {
    data: txRcptData,
    // isError: txRcptError,
    // isPending: txRcptPending
  } = useWaitForTransactionReceipt({
    hash: txdata,
  });

  const handleMaxBalance = async () => {
    const formatted = formatUnits(parseUnits(collateralValue.toString(), decimals), decimals);
    inputRef.current.value = formatted;
    handleAmount({ target: { value: formatted } });
  };

  return (
    <Box>
      <Box
        sx={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {" "}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            width: "100%",
            alignItems: "center",
          }}
        >
          <input
            style={{
              background: " rgba(18, 18, 18, 0.5)",
              border: "1px solid #8E9BAE",
              color: "white",
              fontSize: "1rem",
              fontWeight: "normal",
              fontFamily: "Poppins",
              height: "2.5rem",
              width: "100%",
              borderRadius: "10px",
              paddingLeft: "0.5rem",
            }}
            ref={inputRef}
            type="number"
            onChange={handleAmount}
            placeholder="Amount"
            autoFocus
          />
          <Button
            sx={{
              height: "2rem",
              padding: "5px 12px",
              minWidth: `fit-content`,
              marginLeft: "0.5rem",
              "&:after": {
                backgroundSize: "300% 100%",
              },
            }}
            clickFunction={handleMaxBalance}
          >
            Max
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          margin: "1rem 0rem",
          // fontSize: "0.8rem",
        }}
      >
        {collateralSymbol} to address "{shortenedAddress}"
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}        
      >
        <Button
          sx={{
            marginTop: "1rem",
            marginBottom: "1rem",
            padding: "10px",
            width: "100%",
            height: "1.3rem",
          }}
          clickFunction={
            symbol === "ETH" || symbol === "AGOR"
              ? handlewithdrawCollateralNative
              : handlewithdrawCollateral
          }
          isDisabled={!amount}
          isSuccess
        >
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default Withdraw;
