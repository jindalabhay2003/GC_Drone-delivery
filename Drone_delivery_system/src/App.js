import React, { useEffect, useState } from "react";
import "./app.css";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Component/Login.jsx"
import Home from "./Component/Home";
import "./index.css"
import Navbar from "./Component/Navbar";
import DashboardContent from "./Component/Dashboard.js"

const App = () => {

  return (
    <>
    <Router>
      <Switch>
        <Route exact path="/login" >
          <Login />
        </Route>
        <Route exact path="/" >
          <Home />
        </Route>
        <Route exact path="/admin">
          <DashboardContent />
        </Route>
      </Switch>
    </Router>
    </>
  )
  
};

export default App;
