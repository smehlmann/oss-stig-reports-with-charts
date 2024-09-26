import React, { useEffect, useState } from "react";
import { useAuth } from "oidc-react";
import { useDispatch } from "react-redux";
import "./App.css";
import { getAuth } from "./store/index.js";
import axios from "axios";
import "./Tabs.css";
//import Tabs from './components/tabs/Tabs.jsx';
import TabsComponent from './components/tabs/TabsComponent.jsx';
//import MyTabs from "./components/tabs/TabsComponent.jsx";

function OssStigReports() {
  var auth = useAuth();

  /*===============================================================*/
  /* Logic for refreshing token before it expires */
  /*===============================================================*/
  const dispatch = useDispatch();
  // set the new auth value in the data store
  dispatch({ type: "refresh", auth: auth });

  const expiresIn = auth.userData?.expires_in;
  // calculate the expiration date/time
  const expDate = auth.userData?.expires_at
    ? new Date(auth.userData.expires_at * 1000)
    : null;

  // setting remaining time
  const [remainingTime, setRemainingTime] = useState(expiresIn);

  // reducing remaining time by 1 second every second
  useEffect(() => {
    // Set initial value
    setRemainingTime(expiresIn);

    // Update every second
    const intervalId = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0)); // Prevent negative values
    }, 1000);

    // Clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, [expiresIn]);

  // adding event listener for token expiring from oidc-react
  useEffect(() => {
    const userManager = auth.userManager;
    // event handler for token expiring
    const handleTokenExpiring = () => {
      console.log("Access token expiring event fired");
      console.log(auth.userData);

      // set the new auth value in the data store
      dispatch({ type: "refresh", auth: auth });

      extendSession();
      //setAccessTokenId(auth.userData?.access_token);
    };

    if (userManager) {
      userManager.events.addAccessTokenExpiring(handleTokenExpiring);

      // Remove event listener with the exact function that was added
      return () => {
        userManager.events.removeAccessTokenExpiring(handleTokenExpiring);
      };
    }
  }, [auth, dispatch]);

  /*===============================================================*/

  // error handling for if auth is null/undefined or userData doesn't exist
  if (auth && auth.userData) {
    return <TabsComponent />;
  }
}

async function extendSession() {
  try {
    var storedAuth = getAuth();

    // got error Access to XMLHttpRequest at 'https://npc2ismsdev01.nren.navy.mil/stigmanossreports/logo192.png' from origin
    // 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check:
    // No 'Access-Control-Allow-Origin' header is present on the requested resource.
    // Referrer Policy: strict-origin-when-cross-origin
    var accessToken = storedAuth.userData?.access_token;
    var myUrl =
      "https://npc2ismsdev01.nren.navy.mil/stigmanossreports/logo192.png";

    var resp = await axios.get(myUrl, {
      responseType: "blob",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    //alert('returning resp')
    return resp;
  } catch (e) {
    console.log('extendSession: ' + e.message);
    console.log(e);
  }
}

export default OssStigReports;
