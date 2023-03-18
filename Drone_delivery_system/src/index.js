import React from "react";
import ReactDOM from "react-dom/client" 
import App from "./App";
import AccountProvider from "./Context/AccountProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<GoogleOAuthProvider clientId={`${process.env.REACT_APP_CLIENT_ID}`} ><AccountProvider><App/></AccountProvider></GoogleOAuthProvider> );