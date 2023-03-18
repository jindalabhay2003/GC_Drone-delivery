import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";


export default function Loader() {
  return (
    <Box className="d-flex flex-column justify-content-center align-items-center w-100 bg-white mt-50">
      <CircularProgress style={{ color: "#150336" }} size={90} />
      <Typography color={"black"} fontSize={25} className={"mt-4"}>
        Loading....
      </Typography>
    </Box>
  );
}