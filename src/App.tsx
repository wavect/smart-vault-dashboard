import { Routes, Route } from "react-router-dom";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
  arbitrum,
  arbitrumSepolia
} from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";
import { createWeb3Modal } from '@web3modal/wagmi/react'
import HomePage from "./pages/HomePage.tsx";
//import navbar
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import { Box } from "@mui/material";
import Collateral from "./pages/Collateral.tsx";
import CircularProgressComponent from "./components/CircularProgressComponent.tsx";
import '@walletconnect/ethereum-provider';
import {
  // useCircularProgressStore,
  useRenderAppCounterStore,
} from "./store/Store.ts";
import SnackbarComponent from "./components/SnackbarComponent.tsx";
import { useBackgroundImage } from "./hooks/useBackgroundImage.ts";
import Stats from "./pages/Stats.tsx";
import Yield from "./pages/Yield.tsx";
import Dex from "./pages/Dex.tsx";
import Staking from "./pages/Staking.tsx";
import VaultHistory from "./pages/VaultHistory.tsx";
import TermsOfUse from "./pages/TermsOfUse.tsx";
import Disclaimer from "./components/Disclaimer.tsx";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EthereumProvider } from "@walletconnect/ethereum-provider";

const projectId = "67027f91c1db8751c6ea2ed13b9cdc55";

function App() {
  useBackgroundImage();
  const { renderAppCounter } = useRenderAppCounterStore();

  const queryClient = new QueryClient()

  const wagmiConfig = createConfig({
    chains: [arbitrum, arbitrumSepolia],
    transports: {
      [arbitrum.id]: http(`https://arb-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`),
      [arbitrumSepolia.id]: http(`https://arb-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_SEPOLIA_API_KEY}`)
    },
    connectors: [ walletConnect({projectId}) ],
  });

  createWeb3Modal({ wagmiConfig, projectId, chains: [arbitrum, arbitrumSepolia] });

  return (
    <Box
      sx={{
        overflowX: {
          xs: "scroll",
          md: "hidden",
        },
      }}
    >
      {/* <button onClick={handleRemountClick}>Remount</button>{" "} */}
      <CircularProgressComponent />
      <SnackbarComponent />
      <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Disclaimer />
          <Routes key={renderAppCounter}>
            <Route path="/" element={<HomePage />} />
            <Route path="termsofuse" element={<TermsOfUse />} />
            <Route path="stats" element={<Stats />} />
            <Route path="yield/*" element={<Yield />} />
            <Route path="dex/*" element={<Dex />} />
            <Route path="staking/*" element={<Staking />} />
            {/* <Route path="collateral/:vaultId" element={<Collateral />} /> */}
            {/* <Route path="collateral/:vaultId/history" element={<VaultHistory />} /> */}
          </Routes>
          <Footer />
        </QueryClientProvider>
      </WagmiProvider>
    </Box>
  );
}

export default App;
