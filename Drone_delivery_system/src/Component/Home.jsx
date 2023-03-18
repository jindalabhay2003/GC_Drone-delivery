import React, { useState,useEffect,useContext } from 'react';
import GoogleMapReact from 'google-map-react';
import { Typography } from '@mui/material';
import { MDBBreadcrumb, MDBBreadcrumbItem } from "mdb-react-ui-kit";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Tooltip from '@mui/material/Tooltip';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { displayInfoToast, displayErrorToast, displaySuccessToast } from '../Utils/ToastUtils.js';
import { useHistory } from 'react-router-dom';
import { AccountContext } from '../Context/AccountProvider';
import axios from 'axios';
import Loader from './Loader';


const Home = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const { account, setAccount } = useContext(AccountContext);
  const [loading,setLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const history = useHistory();

  const handleMapClick = (event) => {
    setLocation({ lat: event.lat, lng: event.lng });
    console.log(event.lat,event.lng);
  }

  useEffect(() => {
    if (!localStorage.getItem('jwt')) {
      displayInfoToast("Please first sign in to continue!..");
      history.push('/login');
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const token = window.localStorage.getItem('jwt');
        const Response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/user/getuser`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setAccount(Response.data.user);
        // console.log(Response.data.user);
        if (
          Response.status === 200 &&
          Response.data.user.isRegistrationComplete === false
        ) {

        }
        setLoading(false);
      } catch (err) {
        if (
          err.response &&
          String(err.response.data.error.statusCode).startsWith('4')
        ) {
          return displayErrorToast(err.response.data.message);
        }
        displayErrorToast('There was some error! Please try again later');
      }
    })();
  }, []);

  const handleIncrease = ()=>{
    setAmount(amount+1);
  }

  const handleDecrease = ()=>{
    if(amount === 0){
        return;
    }
    setAmount(amount-1);
  }

  const handleRegistration = async () => {
    if (!localStorage.getItem("jwt")) {
      displayInfoToast("Please first sign in to continue!..");
      return;
    }

    if(amount === 0){
        alert("Please select amount of drones first");
        displayErrorToast("Please select amount of drones first");
        return;
    }
    if(!location.lat){
        alert("Please Choose a location first")
        displayErrorToast("Please Choose a location first");
        return;
    }

    const token = window.localStorage.getItem("jwt");

    try {
      const Response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/user/register`,
        { amount: amount,
          orderlongitude: location.lng,
          orderlatitude: location.lat
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (Response.status === 200) {
        alert(`You have successfully registered ${amount} drones`)
        displaySuccessToast("You have successfully registered  drones");
        // history.replace(`payment/${eventType}/${subEventId}`);
      }
    } catch (err) {
      if (err.response) {
        displayErrorToast(err.response.data.message);
        return;
      }
      displayErrorToast("There was some error! Please try again later");
    }
  };

  const pages = [];
const settings = ['Logout'];

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return !account? <Loader />: (
    <>
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={account?.image} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={()=> setting==="Logout"?history.push("/login"):history.push("/profile")}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4 mt-4 d-flex justify-content-center">
        <MDBBreadcrumbItem
          style={{ fontFamily: "CenturyGothic", fontSize: "1.5rem" }}
        >
          Welcome, {account?account.name:""}
        </MDBBreadcrumbItem>
    </MDBBreadcrumb>
    <div className="" >
    <div  style={{ height: '400px', width: '95%',margin: "2%", marginLeft: "1%" }}>
      <GoogleMapReact
      className="m-2"
        yesIWantToUseGoogleMapApiInternalss
        bootstrapURLKeys={{ key: "AIzaSyDn-1t94CNsBvNFWVVLUKHdW4o10Dh3C6g" }}
        defaultCenter={{ lat: 25.20859599256738, lng: 75.88449993214736 }}
        defaultZoom={10}
        onClick={handleMapClick}
      >
        {location.lat && location.lng && (
          <Marker lat={location.lat} lng={location.lng} />
        )}
      </GoogleMapReact>
    </div>
    <MDBBreadcrumb className="bg-light rounded-3 p-2 mt-4 d-flex">
        <MDBBreadcrumbItem
          style={{ fontFamily: "CenturyGothic", fontSize: "1.5rem" }}
        >
          <Typography style={{marginLeft: "1%"}} variant='h5'>
        <u>Please click on location above to select its coordinates</u>
    </Typography>
    <Typography style={{marginLeft: "1%"}} variant='h5'>
        Latitude: {location.lat?location.lat:"NULL"}        
    </Typography>
    <Typography style={{marginLeft: "1%", marginBottom: "2%"}} variant='h5'>       
        Longitude: {location.lng?location.lng:"NULL"} 
    </Typography>
    <div style={{marginLeft: "1%", marginBottom: "2%"}} >
        <Typography variant='h5'>Number of drones you want to order: {amount} </Typography>
        <div className='d-flex'>
            <div>
        <Button onClick={handleIncrease} variant="outlined" color="primary" startIcon={<AddIcon />}>
      Add
    </Button>
    </div>
    <div onClick={handleDecrease} style={{marginLeft: "10%"}} >
    <Button variant="outlined"  color="primary" startIcon={<RemoveIcon />}>
      Remove
    </Button>
    </div>
    </div>
    </div>
    <div style={{marginLeft: "1%"}}>
        <Typography variant='h4'>
            Place Order: <Button onClick={handleRegistration} variant="contained" size='large' color="primary" startIcon={<HowToRegIcon />}>
      Place Order
    </Button>
        </Typography>
    </div>
    <div style={{marginLeft: "1%", marginTop: "5%"}}>
      {
        account?.drones!==0 &&
      <Typography variant='h4'>
        Your Prev Order Status: {account?.status}
      </Typography>
}
    </div>
        </MDBBreadcrumbItem>
    </MDBBreadcrumb>
    </div>
    </>
  );
};

const Marker = () => <div className="marker">+</div>;

export default Home;
