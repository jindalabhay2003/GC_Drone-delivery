import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AiFillCloseCircle } from "react-icons/ai";
import { TbGridDots } from "react-icons/tb";
import { useContext } from "react";
import { AccountContext } from "../Context/AccountProvider.jsx";
// import { useGoogleLogin } from '@react-oauth/google';
import { toast } from "react-toastify";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect,useState } from "react";
import { CgProfile } from "react-icons/cg";
import { TbLogout } from "react-icons/tb";
import { Stack } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import {
  displayErrorToast,
  displayInfoToast,
  displaySuccessToast,
} from "../Utils/ToastUtils";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function Login() {

  const history = useHistory();
  const { account, setAccount } = useContext(AccountContext);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const isDesktopOrLaptop = useMediaQuery("(min-width: 900px)");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    // console.log(credentialResponse);

    try {
      const loginResponse = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/user/login`,
        { tokenId: credentialResponse.credential },
        {
          withCredentials: true,
        }
      );
      if (loginResponse.status === 201) {
        displaySuccessToast(`Welcome to Alma Fiesta`, { autoClose: 2000 });

        window.localStorage.setItem("jwt", loginResponse.data.jwt);
        window.localStorage.setItem("email", loginResponse.data.user.email);
        setAccount(loginResponse.data.user);
        displayInfoToast("Fill Your Rest Details");
        history.push("/");
      } else if (loginResponse.status === 200) {
        window.localStorage.setItem("jwt", loginResponse.data.jwt);
        window.localStorage.setItem("email", loginResponse.data.user.email);
        setAccount(loginResponse.data.user);
        if (loginResponse.data.user.isRegistrationComplete) {
          displaySuccessToast(`Logged in Successfully`, { autoClose: 2000 });
        } else {
          history.push("/");
        }
      }
    } catch (e) {
      if (String(e.response.data.error.statusCode).startsWith("4")) {
        return toast.error(e.response.data.message);
      }
      toast.error("There was some error! Please try again later");
    }
    // console.log(account);
    
  };

  const handleGoogleLoginFailure = () => {
    toast.error("There was some error! Please try again later");
  };

  const handleGoogleLogout = async () => {
    try {
      const logoutResponse = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/user/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${window.localStorage.getItem("jwt")}`,
          },
          withCredentials: true,
        }
      );
      displayInfoToast("Logged out Successfully!");
      window.localStorage.clear();
      history.push("/login");
      setIsLoggedOut(true);
    } catch (e) {
      if (String(e.response.data.error.statusCode).startsWith("4")) {
        return displayErrorToast(e.response.data.message);
      }
      displayErrorToast("There was some error! Please try again later");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {!localStorage.getItem("jwt") ? (
              <GoogleLogin
                style={{ marginLeft: "1rem" }}
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
                useOneTap
              />
            ) : (
              <Stack
                style={{ marginLeft: "1rem" }}
                direction={isDesktopOrLaptop ? "row" : "column"}
                spacing={2}
              >
                {/* <Button
                  onClick={() => history.push("/profile")}
                  size="small"
                  disableElevation
                  color="secondary"
                  variant="contained"
                  startIcon={<CgProfile />}
                >
                  Profile
                </Button> */}
                {/* TbLogout */}
                <Button
                  className="ml-4"
                  onClick={handleGoogleLogout}
                  size="small"
                  disableElevation
                  color="error"
                  variant="contained"
                  endIcon={<TbLogout />}
                >
                  Logout
                </Button>
              </Stack>
            )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}