require("dotenv").config({ path: "./.env" });

let REACT_APP_PORT = process.env.REACT_APP_PORT;
let REACT_APP_CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
let REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
let RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
let RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
// console.log(process.env.REACT_APP_CLIENT_ID);

module.exports = {
  REACT_APP_PORT,
  REACT_APP_CLIENT_ID,
  REACT_APP_BASE_URL,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET
};