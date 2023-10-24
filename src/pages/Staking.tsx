import { useLayoutEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { getNetwork } from "@wagmi/core";
import { useContractRead, useContractReads, useAccount } from "wagmi";
import { arbitrumGoerli } from "wagmi/chains";

import {
  usePositionStore,
  useStakingAbiStore,
  useContractAddressStore,
} from "../store/Store.ts";

import Card from "../components/Card";
import StakingList from "../components/staking/StakingList";
import StakingPositions from "../components/staking/StakingPositions";

const Staking = () => {
  const rectangleRef = useRef<HTMLDivElement | null>(null);
  const setPosition = usePositionStore((state) => state.setPosition);

  const { stakingAbi } = useStakingAbiStore();

  const {
    arbitrumGoerliContractAddress,
    arbitrumContractAddress
  } = useContractAddressStore();
  const { address } = useAccount();
  const { chain } = getNetwork();

  useLayoutEffect(() => {
    function updatePosition() {
      if (rectangleRef.current) {
        const { right, top } = rectangleRef.current.getBoundingClientRect();
        setPosition({ right, top });
      }
    }

    window.addEventListener("resize", updatePosition);
    updatePosition();

    return () => window.removeEventListener("resize", updatePosition);
  }, [setPosition]);

  const vaultManagerAddress =
  chain?.id === arbitrumGoerli.id
    ? arbitrumGoerliContractAddress
    : arbitrumContractAddress;
  
  //////////////////////////
  // Handling Directory List
  const { data: stakingAddresses } = useContractRead({
    address: "0xda81118Ad13a2f83158333D7B7783b33e388E183",
    abi: stakingAbi,
    functionName: "list",
  });

  const contracts: any = stakingAddresses?.map(address => {
    const baseContract = {
      address,
      abi: stakingAbi
    }
    return [
      {
        ...baseContract,
        functionName: 'active'
      },
      {
        ...baseContract,
        functionName: 'windowStart'
      },
      {
        ...baseContract,
        functionName: 'windowEnd'
      },
      {
        ...baseContract,
        functionName: 'maturity'
      },
      {
        ...baseContract,
        functionName: 'SI_RATE'
      },
      {
        ...baseContract,
        functionName: 'tstEUROsPrice'
      },
    ]
  }).flat();

  const { data: stakingData } = useContractReads({contracts});

  const nestedStakingData = stakingData && stakingAddresses?.map((address, i) => {
    return {
      address: address,
      active: stakingData[i * 6].result,
      windowStart: stakingData[i * 6 + 1].result,
      windowEnd: stakingData[i * 6 + 2].result,
      maturity: stakingData[i * 6 + 3].result,
      SI_RATE: stakingData[i * 6 + 4].result,
      tstEUROsPrice: stakingData[i * 6 + 5].result
    }
  });
  // 

  /////////////////////
  // Handling Positions
  const positions: any = stakingAddresses?.map(stakeAddress => {
    return [
      {
        address: stakeAddress,
        abi: stakingAbi,
        functionName: "position",
        args: [address],
      }
    ]
  }).flat();

  const { data: positionData } = useContractReads({contracts: positions, watch: true});

  const nestedPositionData = positionData && nestedStakingData && stakingAddresses?.map((address, i) => {
    const positionItem: any = positionData[i].result;
    const stakingItem: any = nestedStakingData[i];
    return {
      address: address,
      burned: positionItem.burned,
      nonce: positionItem.nonce,
      open: positionItem.open,
      reward: positionItem.reward,
      stake: positionItem.stake,
      tokenId: positionItem.tokenId,
      maturity: stakingItem.maturity,
      windowStart: stakingItem.windowStart,
      windowEnd: stakingItem.windowEnd,
    }
  });
  // 

  return (
    <Box>
      <Card
        sx={{
          margin: {
            xs: "0% 4%",
            sm: "3% 6%",
            md: "3% 12%",
          },
          padding: "1.5rem",
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            margin: "1rem 0",
            marginTop: "0",
            fontSize: {
              xs: "1.5rem",
              md: "2.125rem"
            }
          }}
          variant="h4"
        >
          Staking The Standard Token (TST)
        </Typography>
        <Typography
          sx={{
            marginBottom: "1rem",
            fontSize: {
              xs: "1rem",
              md: "1.2rem",
            },
            opacity: "0.9",
            fontWeight: "300",
          }}
        >
          The yields of this pooled fund come from fees paid by borrowers. By staking TST you help stabilize the price of TST while also being rewarded. Yield is paid out in EUROs.
        </Typography>
        <Box>
          <StakingList
            stakingData={nestedStakingData || []}
            vaultManagerAddress={vaultManagerAddress}
          />
        </Box>
      </Card>
      <Card
        sx={{
          margin: {
            xs: "3% 4%",
            sm: "3% 6%",
            md: "3% 12%",
          },
          padding: "1.5rem",
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            margin: "1rem 0",
            marginTop: "0",
            fontSize: {
              xs: "1.2rem",
              md: "1.5rem"
            }
          }}
          variant="h4"
        >
          Staking Positions
        </Typography>
        <StakingPositions
          stakingPositionsData={nestedPositionData || []}
        />
      </Card>
    </Box>
  );
};

export default Staking;
