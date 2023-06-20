import { Box, Modal, Typography } from "@mui/material";
import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import {
  useVaultAddressStore,
  useTransactionHashStore,
  useCircularProgressStore,
  useSnackBarStore,
} from "../../../store/Store";
import QRicon from "../../../assets/qricon.png";
// import smartVaultAbi from "../../../abis/smartVault";
import { ethers } from "ethers";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import { useAccount } from "wagmi";
import MetamaskIcon from "../../../assets/metamasklogo.svg";
import { parseEther } from "viem";
import { createWalletClient, custom } from "viem";
// import { sepolia } from "viem/chains";
import { arbitrumGoerli, goerli } from "wagmi/chains";
// import { polygonMumbai } from "wagmi/chains";

const Deposit = () => {
  //modal states
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [amount, setAmount] = useState(0);
  ///store
  const { vaultAddress } = useVaultAddressStore.getState();
  const { getTransactionHash } = useTransactionHashStore.getState();
  const { getCircularProgress, getProgressType } = useCircularProgressStore();

  const { getSnackBar } = useSnackBarStore();

  // const { address } = useAccount();

  const handleAmount = (e: any) => {
    setAmount(Number(e.target.value));
    console.log(e.target.value);
  };

  //clipboard logic
  const textRef = useRef<HTMLSpanElement>(null);

  // Function to handle copying the text
  const handleCopyText = () => {
    const textElement = textRef.current;

    // Check if the browser supports the Clipboard API
    if (navigator.clipboard && textElement) {
      const text = textElement.innerText;

      // Copy the text to the clipboard
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("Text copied to clipboard:", text);
          getSnackBar(0);
          //handleSnackbarClick();
        })

        .catch((error) => {
          console.error("Error copying text to clipboard:", error);
        });
    }
  };
  //clipboard logic end

  const walletClient = createWalletClient({
    //need to make this dynamic also
    chain: arbitrumGoerli,
    transport: custom(window.ethereum),
  });

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const depositViaMetamask = async () => {
    const [account] = await walletClient.getAddresses();

    let txHashForError = "";
    try {
      // const signer = provider.getSigner();
      // const contract = new ethers.Contract(vaultAddress, smartVaultAbi, signer);
      // Prompt user to enter the amount in MetaMask
      const txAmount: any = amount;
      console.log(txAmount);
      // const transactionParameters = {
      //   to: vaultAddress,
      //   from: address,
      //   value: parseEther("0.1"),
      // };

      // Send funds using MetaMask
      // const txHash = await window.ethereum.request({
      //   method: "eth_sendTransaction",
      //   params: [transactionParameters],
      // });
      //this value is used for error handling due to scoping issues
      const toAddress: any = vaultAddress;

      const txHash = await walletClient.sendTransaction({
        account,
        to: toAddress,
        value: parseEther(txAmount.toString()),
      });
      txHashForError = txHash;

      console.log("Transaction sent:", txHash);
      getTransactionHash(txHash);
      waitForTransaction(txHash);
    } catch (error) {
      waitForTransaction(txHashForError);
      console.log(error);
    }
  };

  const waitForTransaction = async (_transactionHash: string) => {
    try {
      getProgressType(2);

      getCircularProgress(true);
      await provider.waitForTransaction(_transactionHash);
      getCircularProgress(false); // Set getCircularProgress to false after the transaction is mined
      getSnackBar(0);
    } catch (error) {
      console.log(error);
      getCircularProgress(false);
      getSnackBar(1);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
          // marginLeft: "6px",
          // border: "2px solid red",
          padding: "0",
        }}
      >
        <Box
          sx={{
            //    margin: "2px",
            padding: "5px 0",
            cursor: "pointer",
            height: "2rem",
            minWidth: `33%`,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="myBtn"
          onClick={handleOpen}
        >
          {" "}
          <img
            style={{
              height: "23px",

              marginRight: "1rem",
            }}
            src={QRicon}
            alt="qricon"
          />
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8rem",
            }}
          >
            {" "}
            With QR Code{" "}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontSize: "1rem",
            margin: "0 1rem",
          }}
        >
          or
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
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
              margin: "0.5rem",
              width: "100%",
              borderRadius: "10px",
              paddingLeft: "0.5rem",
            }}
            type="text"
            onChange={handleAmount}
            placeholder="Enter amount"
            autoFocus
          />
          <Box
            sx={{
              margin: "2px",
              padding: "10px",
              cursor: "pointer",
              width: "2rem",
              height: "1.3rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="myBtn"
            onClick={depositViaMetamask}
          >
            {" "}
            <img
              style={{ width: "2rem", height: "auto" }}
              src={MetamaskIcon}
              alt="metamaskicon"
            />{" "}
          </Box>
        </Box>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: { xs: "absolute" as const, md: "" },
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "60%",
              sm: "50%",
              md: "40%",
            },
            background:
              "linear-gradient(110.28deg, rgba(26, 26, 26, 0.156) 0.2%, rgba(0, 0, 0, 0.6) 101.11%)",
            borderRadius: "10px",
            padding: "0",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(13.9px)",
            WebkitBackdropFilter: "blur(13.9px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            p: 4,
            maxHeight: {
              xs: "80vh",
              sm: "80vh",
            },
            overflowY: "auto",
          }}
          className="modal-content" // add class name to modal content box
        >
          {" "}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box style={{ background: "white", padding: "16px" }}>
              <QRCode value={vaultAddress} />{" "}
            </Box>
            <Typography variant="body1" component="div" sx={{ mt: 2 }}>
              Scan QR code to deposit collateral
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span ref={textRef}>{vaultAddress}</span>
              <Box
                sx={{
                  cursor: "pointer",
                }}
                onClick={handleCopyText}
              >
                {" "}
                <ContentCopyIcon />
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Deposit;
