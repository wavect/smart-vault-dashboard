import { Network, Alchemy, AssetTransfersCategory } from "alchemy-sdk";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { styles } from "../styles/dataGridStyles";

const History = () => {
  const config = {
    apiKey: "7u8XX7fS7FzYP78RV1sk3WzNmTpZWDSH", // Replace with your Alchemy API Key.
    network: Network.ETH_GOERLI, // Replace with your network.
  };

  const alchemy = new Alchemy(config);

  // Print all NFTs returned in the response:
  async function getNftsForOwner() {
    const owner = "0x600044FE9A152C27f337BbB23803dC6A68E3eFB0";
    const nfts = await alchemy.nft.getNftsForOwner(owner);
    console.log(nfts);
  }

  getNftsForOwner();

  const foo = async () => {
    //Assign the contract address to a variable
    const toAddress = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

    //The response fetches the transactions the specified addresses.
    const response = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: toAddress,
      toAddress: toAddress,
      excludeZeroValue: true,
      category: [AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC721],
    });

    //Logging the response to the console
    console.log(response);
  };

  foo();

  const getRowClassName = (_params: any) => {
    return "no-border";
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "#", width: 90 },
    { field: "col1", headerName: "Action", width: 250 },
    { field: "col2", headerName: "Vault", width: 250 },
    { field: "col3", headerName: "Vault type", width: 250 },
    { field: "col4", headerName: "Description", width: 250 },
    { field: "col5", headerName: "Amount", width: 250 },
  ];

  const rows: GridRowsProp = [
    {
      id: 1,
      col1: "asdsadasd",
      col2: "World",
      col3: "World",
      col4: "World",
      col5: "World",
    },
    {
      id: 2,
      col1: "Hello",
      col2: "World",
      col3: "World",
      col4: "World",
      col5: "World",
    },
    {
      id: 3,
      col1: "Hello",
      col2: "World",
      col3: "World",
      col4: "World",
      col5: "World",
    },
    {
      id: 4,
      col1: "Hello",
      col2: "World",
      col3: "World",
      col4: "World",
      col5: "World",
    },
  ];

  return (
    <Box
      sx={{
        margin: "3% 9%",
        padding: "3%",
        // marginTop: "50px",
        borderRadius: "16px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(5px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        background: "rgba(255, 255, 255, 0.07)",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <input
          style={{
            background: "transparent",
            width: "20rem",
            height: "1.5rem",
          }}
          type="text"
          placeholder="Search"
        />
        <button
          style={{
            height: "2rem",
            width: "10rem",
            margin: "0 1rem",
          }}
          className="glowingCard"
        >
          + Add product
        </button>
      </Box>
      <style>{styles}</style>
      <DataGrid
        sx={{
          height: "90%",
          background: "red",
        }}
        rows={rows}
        columns={columns}
        getRowClassName={getRowClassName}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default History;
