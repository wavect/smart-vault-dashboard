import React, { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { Box, Typography, CircularProgress } from "@mui/material";
import { formatUnits, parseUnits } from "viem";
import { useWriteContract } from "wagmi";
import axios from "axios";

import {
  useVaultStore,
  useVaultAddressStore,
  useSmartVaultABIStore,
  useSnackBarStore,
  useCircularProgressStore,
} from "../../../store/Store";

import Select from "../../../components/Select";
import Button from "../../../components/Button";

interface SwapProps {
  symbol: string;
  tokenAddress: string;
  decimals: number;
  token: any;
  collateralValue: any;
  collateralSymbol: string;
  assets: any;
}

const Swap: React.FC<SwapProps> = ({
  collateralSymbol,
  assets,
  symbol,
  decimals,
  collateralValue,
}) => {
  const [swapLoading, setSwapLoading] = useState<any>(false);
  const [swapAssets, setSwapAssets] = useState<any>();
  const [amount, setAmount] = useState<any>(0);
  const [receiveAmount, setReceiveAmount] = useState<any>(0);
  const [receiveAsset, setReceiveAsset] = useState<any>('');
  const [receiveDecimals, setReceiveDecimals] = useState<any>();
  const { vaultStore } = useVaultStore();
  const inputRef: any = useRef<HTMLInputElement>(null);
  const inputReceiveRef: any = useRef<HTMLInputElement>(null);
  const { vaultAddress } = useVaultAddressStore();
  const { smartVaultABI } = useSmartVaultABIStore();

  const { getSnackBar } = useSnackBarStore();

  const { getCircularProgress, getProgressType } = useCircularProgressStore();
  
  const handlereceiveAsset = (e: any) => {
    setReceiveAsset(e.target.value as string);
    const useToken = swapAssets?.find((item: any) => item.symbol === e.target.value);
    setReceiveDecimals(useToken?.dec)
  };

  const handleAmount = (e: any) => {
    setAmount(parseUnits(e.target.value.toString(), decimals))
  };

  const handleMinReturn = (e: any) => {
    setReceiveAmount(parseUnits(e.target.value.toString(), receiveDecimals));
  };

  const getSwapConversion = async () => {
    try {
      setSwapLoading(true);
      const swapIn = symbol;
      const swapOut = receiveAsset;
      const swapAmount = amount.toString();
      const response = await axios.get(
        `https://smart-vault-api.thestandard.io/estimate_swap?in=${swapIn}&out=${swapOut}&amount=${swapAmount}`
      );
      const data = response.data;
      setReceiveAmount(BigInt(data));
      inputReceiveRef.current.value = formatUnits(data.toString(), receiveDecimals);
      setSwapLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (amount && receiveAsset && symbol) {
      getSwapConversion();
    }
  }, [amount, receiveAsset]);

  useEffect(() => {
    const useAssets: Array<any> = [];
    assets.map((asset: any) => {
      const token = asset.token;
      const symbol = ethers.utils.parseBytes32String(token?.symbol);
      const obj = {
        addr: token?.addr,
        clAddr: token?.clAddr,
        clDec: token?.clDec,
        dec: token?.dec,
        symbol: symbol,
      }
      return (
        useAssets.push(obj)
      );
    });
    setSwapAssets(useAssets)
  }, []);

  const availableAssets = swapAssets?.filter((item: any) => item.symbol !== symbol);

  const { writeContract, isError, isPending, isSuccess, error } = useWriteContract();

  const handleSwapTokens = async () => {
    try {
      writeContract({
        abi: smartVaultABI,
        address: vaultAddress as any,
        functionName: "swap",
        args: [
          ethers.utils.formatBytes32String(symbol),
          ethers.utils.formatBytes32String(receiveAsset),
          amount,
          receiveAmount,
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
      getProgressType('SWAP');
      getCircularProgress(true);
      setSwapLoading(true);
    } else if (isSuccess) {
      getSnackBar('SUCCESS', 'Success!');
      getCircularProgress(false);
      setSwapLoading(false);
      inputRef.current.value = "";
      setAmount(0);
      setReceiveAmount(0);
      setReceiveAsset('');
    } else if (isError) {
      getSnackBar('ERROR', 'There was an error');
      getCircularProgress(false);
      setSwapLoading(false);
      inputRef.current.value = "";
      setAmount(0);
      setReceiveAmount(0);
      setReceiveAsset('');
    }
  }, [
    isPending,
    isSuccess,
    isError,
    error
  ]);

  const handleMaxBalance = async () => {
    const formatted = formatUnits(parseUnits(collateralValue.toString(), decimals), decimals);
    inputRef.current.value = formatted;
    handleAmount({ target: { value: formatted } });
  };

  if (vaultStore.status.version !== 1 && vaultStore.status.version !== 2) {
    return (
      <Box>
        <Box
          sx={{
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              width: "100%",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <Typography
              sx={{
                whiteSpace: "nowrap",
                marginRight: "0.5rem",
                minWidth: "112px",
              }}
            >
              Swap Amount:
            </Typography>
            <input
              style={{
                background: "rgba(18, 18, 18, 0.5)",
                border: "1px solid #8E9BAE",
                color: "white",
                fontSize: "1rem",
                fontWeight: "normal",
                fontFamily: "Poppins",
                height: "2.5rem",
                width: "100%",
                borderRadius: "10px",
                paddingLeft: "0.5rem",
                boxSizing: "border-box",
                MozBoxSizing: "border-box",
                WebkitBoxSizing: "border-box",
              }}
              ref={inputRef}
              type="number"
              onChange={handleAmount}
              placeholder={ collateralSymbol ? (
                `Amount of ${collateralSymbol} to Swap`
              ) : (
                `Amount to Swap`
              )}
            />
            <Button
              sx={{
                height: "2.5rem",
                boxSizing: "border-box",
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
          <Box
            sx={!amount ? (
              {
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                width: "100%",
                alignItems: "center",
                marginBottom: "1rem",
                opacity: "0.3",
              }
            ) : (
              {
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                width: "100%",
                alignItems: "center",
                marginBottom: "1rem",
              }
            )}
          >
            <Typography
              sx={{
                whiteSpace: "nowrap",
                marginRight: "0.5rem",
                minWidth: "112px",
              }}
            >
              Swap For:
            </Typography>
            <Select
              id="swap-asset-select"
              value={receiveAsset}
              label="Asset"
              handleChange={handlereceiveAsset}
              optName="symbol"
              optValue="symbol"
              options={availableAssets || []}
              disabled={!amount}
            >
            </Select>
          </Box>
          <Box
            // sx={!amount || !receiveAsset || !receiveAmount ? (
            sx={!amount || !receiveAsset ? (
                {
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                width: "100%",
                alignItems: "center",
                marginBottom: "1rem",
                opacity: "0.3",
              }
            ) : (
              {
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                width: "100%",
                alignItems: "center",
                marginBottom: "1rem",
              }
            )}
          >
            <Typography
              sx={{
                whiteSpace: "nowrap",
                marginRight: "0.5rem",
                minWidth: "112px",
              }}
            >
              Min. Return:
            </Typography>
            <input
              style={{
                background: "rgba(18, 18, 18, 0.5)",
                border: "1px solid #8E9BAE",
                color: "white",
                fontSize: "1rem",
                fontWeight: "normal",
                fontFamily: "Poppins",
                height: "2.5rem",
                width: "100%",
                borderRadius: "10px",
                paddingLeft: "0.5rem",
                boxSizing: "border-box",
                MozBoxSizing: "border-box",
                WebkitBoxSizing: "border-box",
              }}
              // value={swapLoading ? (
              //   ''
              // ) : (
              //   receiveAmount
              // )}
              ref={inputReceiveRef}
              type="number"
              onChange={handleMinReturn}
              placeholder="Amount"
              // readOnly
            />
          </Box>
          {receiveAsset === 'PAXG' || symbol === 'PAXG' ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  marginBottom: "1rem"
                }}
              >
                Due to low PAXG liquidity on Arbitrum this swap is currently not recommended.
                <br/>
                <a
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    fontWeight: "bold",
                    display: "block",
                    marginTop: "1rem",
                  }}
                  href="https://paxos.com/contact/"
                  target="_blank"
                >
                  Contact Paxos to request they put more liquidity on Arbitrum.
                </a>
              </Typography>
            </Box>
          ) : (null)}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Button
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginBottom: "1rem",
                padding: "10px",
                height: "1.3rem",
              }}            
              isDisabled={
                !amount||
                !receiveAsset ||
                !(receiveAmount > 0) ||
                swapLoading
              }
              isSuccess={!swapLoading}
              clickFunction={handleSwapTokens}
            >
              {swapLoading ? (
                <CircularProgress size="1.5rem" />
              ) : (
                'Continue'
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    );  
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",

        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          marginTop: "1rem",
        }}
      >
        <Typography
          variant="h6"
          style={{textAlign: 'center', marginBottom: "1rem"}}
        >
          {vaultStore.status.version ? (
            <>
              {vaultStore.status.version == 2 ? (
                <>
                  Asset Swapping Is No Longer Available in V2 Vaults
                </>
              ) : (
                <>
                  Asset Swapping Is Not Available in V{vaultStore.status.version} Vaults
                </>
              )}
            </>
          ) : (
            'Asset Swapping Is Not Available'
          )}
        </Typography>
        <Typography
          variant="body1"
          style={{textAlign: 'center'}}
        >
          {/* To get access to asset swapping, create yourself a new vault and consolidate your assets there first. */}
          {vaultStore.status.version == 2 ? (
            <>
              Asset swapping will return soon with the upcoming introduction of V3 vaults.
            </>
          ) : (
            <>
              Asset swapping is coming soon with the upcoming introduction of V3 vaults.
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );  

};

export default Swap;
