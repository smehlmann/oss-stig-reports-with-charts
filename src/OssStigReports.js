import React, { useEffect, useState } from 'react';
import { useAuth } from 'oidc-react';
import { useDispatch } from 'react-redux';
import './App.css';
import { CSVLink } from 'react-csv';
import ClipLoader from "react-spinners/ClipLoader";
import * as GenerateReport from './reports/GenerateReport.js';
import ReportColumns from './components/ReportColumns';
//import $ from 'jquery';
import { getAuth } from './store/index.js';
import { getReportData } from './store/index.js';
import axios from 'axios';
import * as reportUtils from './reports/reportUtils.js';
import './Tabs.css';
import Tabs from './components/tabs/Tabs.jsx';



function OssStigReports() {

  var auth = useAuth();
  const idToken = auth.userData?.id_token;
  // console.log(idToken);

  /*===============================================================*/
  /* Logic for refreshing token before it expires */
  /*===============================================================*/
  const dispatch = useDispatch();
  // set the new auth value in the data store
  dispatch({ type: 'refresh', auth: auth });

  const expiresIn = auth.userData?.expires_in
  // calculate the expiration date/time
  const expDate = auth.userData?.expires_at
    ? new Date(auth.userData.expires_at * 1000)
    : null

  // setting remaining time
  const [remainingTime, setRemainingTime] = useState(expiresIn)

  // reducing remaining time by 1 second every second
  useEffect(() => {
    // Set initial value
    setRemainingTime(expiresIn)

    // Update every second
    const intervalId = setInterval(() => {
      setRemainingTime(prev => (prev > 0 ? prev - 1 : 0)); // Prevent negative values
    }, 1000)

    // Clear interval when component unmounts
    return () => clearInterval(intervalId)
  }, [expiresIn])

  // event handler for token expiring
  const handleTokenExpiring = () => {
    console.log('Access token expiring event fired');
    console.log(auth.userData);

    // set the new auth value in the data store
    dispatch({ type: 'refresh', auth: auth });

    extendSession();
    //setAccessTokenId(auth.userData?.access_token);
  };

  // adding event listener for token expiring from oidc-react 
  useEffect(() => {
    const userManager = auth.userManager;

    if (userManager) {
      userManager.events.addAccessTokenExpiring(handleTokenExpiring);

      // Remove event listener with the exact function that was added
      return () => {
        userManager.events.removeAccessTokenExpiring(handleTokenExpiring);
      };
    }
  }, [auth, handleTokenExpiring]);


  /*===============================================================*/

  // error handling for if auth is null/undefined or userData doesn't exist
  if (auth && auth.userData) {
    return (

      <Tabs />
    )
  }
}

async function callAPI(auth, report, emassNums, numDaysOver) {

  //alert('callAPI report: ' + report);

  var rows = await GenerateReport.GenerateReport(auth, report, emassNums, numDaysOver);
  //alert('calApi number of rows retruned: ' + rows.length);

  return rows;
}

async function extendSession() {

  try {

    var storedAuth = getAuth();

    // got error Access to XMLHttpRequest at 'https://npc2ismsdev01.nren.navy.mil/stigmanossreports/logo192.png' from origin 
    // 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
    // No 'Access-Control-Allow-Origin' header is present on the requested resource.
    // Referrer Policy: strict-origin-when-cross-origin
    var accessToken = storedAuth.userData?.access_token;
    var myUrl = 'https://npc2ismsdev01.nren.navy.mil/stigmanossreports/logo192.png';
    /*
        var resp = await axios
          .head(myUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
    
        return resp;
    */

    /*
        const headers = { 'Authorization': `Bearer ${accessToken}` }
    
        await fetch(myUrl,
          {
            method: "HEAD",
            mode: 'cors',
            Authorization: `Bearer ${accessToken}`
          })
          .then((response) => {
            if (response.status === 200) {
              console.log('success');
            } else {
              console.log('error');
            }
          })
          .catch((error) => {
            console.log('network error: ' + error);
          });    
    */

    var resp = await axios.get(myUrl, {
      responseType: 'blob',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
        Authorization: `Bearer ${accessToken}`
      }
    });

    //alert('returning resp')
    return resp;

    // got a 404 return status
    /*await $.ajax({
      type: 'HEAD',
      url: 'https://npc2ismsdev01.nren.navy.mil/stigmanossreports/logo192.png',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      success: function () {
        console.log('File exists');
      },
      error: function () {
        console.log('File does not exist');
      }
    });*/

  }
  catch (e) {
    console.log(e.message);
    console.log(e);
  }

  /*await $.ajax({
    type: 'HEAD',
    url: 'https://npc2ismsdev01.nren.navy.mil/stigmanossreports/logo192.png',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    success: function () {
      console.log('File exists');
    },
    error: function () {
      console.log('File does not exist');
    }
  });
}
catch (e) {
  console.log(e.message);
}*/

}

export default OssStigReports;