import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button } from "@mui/material";

interface StepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalChildState: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokenMap: any;
  onDataFromChild: (data: number) => void;
}
const StepOne: React.FC<StepProps> = ({
  modalChildState,
  tokenMap,
  onDataFromChild,
}) => {
  function handleClick() {
    const data = 2;
    onDataFromChild(data);
  }

  console.log(tokenMap);
  console.log(modalChildState);
  return (
    <Box sx={{}}>
      <Box sx={{}}>
        <img style={{}} src={tokenMap.get(modalChildState).image} alt="NFT" />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontStyle: "normal",
            fontWeight: "700",
            fontSize: {
              xs: "14px",
              sm: "24px",
            },
            lineHeight: "27px",
          }}
          variant="h6"
          component="div"
        >
          {tokenMap.get(modalChildState).name}
        </Typography>
        <Typography
          sx={{
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: {
              xs: "12px",
              sm: "16px",
            },
            lineHeight: "141.5%",
            textAlign: "right",
            color: "#8E9BAE",
          }}
          variant="body2"
          component="div"
        >
          Smart Vault type:{" "}
          <span
            style={{
              color: "white",
            }}
          >
            {tokenMap.get(modalChildState).attributes[8].value}
          </span>
        </Typography>
      </Box>
      {/* bg color different */}
      <Box>
        <Typography
          sx={{
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: "16px",
            lineHeight: "141.5%",
            color: "#8E9BAE",
            margin: "25px 0 10px 0",
          }}
          variant="body2"
          component="div"
        >
          Collateral
        </Typography>
        <Card
          sx={{
            background:
              "linear-gradient(110.28deg, rgba(26, 26, 26, 0.156) 0.2%, rgba(0, 0, 0, 0.6) 101.11%)",
            borderRadius: "10px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(13.9px)",
            WebkitBackdropFilter: "blur(13.9px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: {
                  xs: "12px",
                  sm: "16px",
                },
                lineHeight: "141.5%",
                color: "#8E9BAE",
              }}
              gutterBottom
            >
              {tokenMap.get(modalChildState).attributes[4].trait_type}
            </Typography>{" "}
            <Typography
              sx={{
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },
              }}
              gutterBottom
            >
              {tokenMap.get(modalChildState).attributes[4].value}
            </Typography>
          </CardContent>{" "}
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: {
                  xs: "12px",
                  sm: "16px",
                },
                lineHeight: "141.5%",
                color: "#8E9BAE",
              }}
              gutterBottom
            >
              {tokenMap.get(modalChildState).attributes[5].trait_type}
            </Typography>{" "}
            <Typography
              sx={{
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },
              }}
              gutterBottom
            >
              {tokenMap.get(modalChildState).attributes[5].value}
            </Typography>
          </CardContent>{" "}
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: {
                  xs: "12px",
                  sm: "16px",
                },
                lineHeight: "141.5%",
                color: "#8E9BAE",
              }}
              gutterBottom
            >
              {tokenMap.get(modalChildState).attributes[6].trait_type}
            </Typography>{" "}
            <Typography
              sx={{
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },
              }}
              gutterBottom
            >
              {tokenMap.get(modalChildState).attributes[6].value}
            </Typography>
          </CardContent>
          <div
            style={{
              height: "1px",
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginLeft: "1rem",
            }}
          >
            <div
              style={{
                height: "1px",
                width: "90%",
                background: "#8E9BAE",
              }}
            ></div>
          </div>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: {
                  xs: "12px",
                  sm: "16px",
                },
                lineHeight: "141.5%",
                color: "#8E9BAE",
              }}
              gutterBottom
            >
              Total value
            </Typography>{" "}
            <Typography
              sx={{
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },
              }}
              gutterBottom
            >
              {tokenMap.get(modalChildState).attributes[6].value}
            </Typography>
          </CardContent>
        </Card>
        <Typography
          sx={{
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: "16px",
            lineHeight: "141.5%",
            color: "#8E9BAE",
            margin: "25px 0 10px 0",
          }}
          variant="body2"
          component="div"
        >
          Debt
        </Typography>
        <Card
          sx={{
            background:
              "linear-gradient(110.28deg, rgba(26, 26, 26, 0.156) 0.2%, rgba(0, 0, 0, 0.6) 101.11%)",
            borderRadius: "10px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(13.9px)",
            WebkitBackdropFilter: "blur(13.9px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: {
                  xs: "12px",
                  sm: "16px",
                },
                lineHeight: "141.5%",
                color: "#8E9BAE",
              }}
              gutterBottom
            >
              {tokenMap.get(modalChildState).attributes[4].trait_type}
            </Typography>{" "}
            <Typography
              sx={{
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },
              }}
              gutterBottom
            >
              {tokenMap.get(modalChildState).attributes[4].value}
            </Typography>
          </CardContent>{" "}
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: {
                  xs: "12px",
                  sm: "16px",
                },
                lineHeight: "141.5%",
                color: "#8E9BAE",
              }}
              gutterBottom
            >
              {tokenMap.get(modalChildState).attributes[5].trait_type}
            </Typography>{" "}
            <Typography
              sx={{
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },
              }}
              gutterBottom
            >
              {tokenMap.get(modalChildState).attributes[5].value}
            </Typography>
          </CardContent>{" "}
          <div
            style={{
              height: "1px",
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginLeft: "1rem",
            }}
          >
            <div
              style={{
                height: "1px",
                width: "90%",
                background: "#8E9BAE",
              }}
            ></div>
          </div>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: {
                  xs: "12px",
                  sm: "16px",
                },
                lineHeight: "141.5%",
                color: "#8E9BAE",
              }}
              gutterBottom
            >
              Total value minus debt
            </Typography>{" "}
            <Typography
              sx={{
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },
              }}
              gutterBottom
            >
              {tokenMap.get(modalChildState).attributes[6].value}
            </Typography>
          </CardContent>
        </Card>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: "13px",
              lineHeight: "24px",
              color: "#8E9BAE",
              margin: "20px 0 10px 0",
            }}
            variant="body2"
            component="div"
          >
            Whoever controls this NFT controls the smart vault.<br></br> If you
            need liquidity, you can sell your smart Vault NFT and the owner can
            pay down the debt and unlock the collateral.
          </Typography>
          <Button
            onClick={handleClick}
            sx={{
              marginLeft: "10px",
              padding: "10px 10px",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              boxShadow:
                "0 5px 15px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.2)",
              fontFamily: '"Poppins", sans-serif',
              color: "#ffffff",
              fontSize: "1rem",
              letterSpacing: "1px",
              backdropFilter: "blur(8px)",
              cursor: "pointer",
              borderRadius: "10px",
              transition: "0.5s",
              position: "relative",
              "&:after": {
                content: '""',
                position: "absolute",
                height: "100%",
                width: "100%",
                top: "0",
                left: "0",
                background:
                  "linear-gradient(45deg, transparent 50%, rgba(255, 255, 255, 0.03) 58%, rgba(255, 255, 255, 0.16) 67%, transparent 68%)",
                backgroundSize: "200% 100%",
                backgroundPosition: "165% 0",
                transition: "0.7s",
              },
              "&:hover:after": {
                backgroundPosition: "-20% 0",
              },
              "&:hover": {
                boxShadow: "15px 30px 32px rgba(0, 0, 0, 0.5)",
                transform: "translateY(-5px)",
              },
              "&:active": {
                transform: "translateY(0)",
                border: "2px solid rgba(152, 250, 250, 0.5)",
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
              },
              "&.activeBtn": {
                background:
                  "linear-gradient(110.28deg, rgba(0, 0, 0, 0.156) 0.2%, rgba(14, 8, 8, 0.6) 101.11%)",
              },
            }}
          >
            <Typography
              sx={{
                color: "#afafaf",
              }}
            >
              List on opensea
            </Typography>
          </Button>{" "}
        </Box>
      </Box>
    </Box>
  );
};

export default StepOne;
