import React, { useState, useEffect } from "react";
import OssStigReportsTab from "./OssStigReportsTab";
import DashboardTab from "./DashboardTab";
import "./TabComponentStyles.css";
import useLocalStorageListener from "../useLocalStorageListener.js";
import * as Tabs from "@radix-ui/react-tabs";
import { getReportData } from "../../store/";

const TabsComponent = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [disableDashboard, setDisableDashboard] = useState(true);
  const [storedData, setStoredData] = useState();

  useEffect(() => {
    // console.log("BarChartBuilder from useEffect");
    //if (localStorage.getItem("ossStigReport")) {
      if (getReportData()) {
      setDisableDashboard(false);
    }
  }, []);

  //useLocalStorageListener((event) => {
  const handleStorageEvent = async (event) => {
    console.log("hi from handleStorageEvent");
    if (event.type === "storage") {
      console.log("hi from useLocalStorageListener");
      const selectedReport = localStorage.getItem("selectedReport");
      if (selectedReport === "14") {
        const reportData = await fetchReportData();
        setStoredData(reportData);
        setDisableDashboard(false);


        //console.log("reportData from tabscomponent: ", reportData);
        return (
          <DashboardTab
            reportData={reportData}
            selectedReportNum={selectedReport}
          />
        );
      } else {
        var myData = getReportData();
        console.log(myData);
        if(myData){
          //setStoredData(myData);
          setStoredData(myData);
          console.log("storedData: " + storedData);
          if (
            selectedReport === "5" ||
            selectedReport === "7" ||
            selectedReport === "8" ||
            selectedReport === "9" ||
            selectedReport === "11"
          ) {
            setDisableDashboard(false);
          } else {
            setDisableDashboard(true);
          }
        } else {
          setDisableDashboard(true);
        }
        /*if (localStorage.getItem("ossStigReport")) {
          setStoredData(localStorage.getItem("ossStigReport"));
        }*/
      }
    }
  };

  useLocalStorageListener(handleStorageEvent);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const selectedReport = localStorage.getItem("selectedReport");

  return (
    <Tabs.Root
      defaultValue="tab1"
      className="tabs-root"
      onValueChange={handleTabChange}
    >
      <Tabs.List aria-label="Tabs" className="tabs-list">
        <Tabs.Trigger className="tabs-trigger" value="tab1">
          Report Generator
        </Tabs.Trigger>
        {!disableDashboard && (
          <Tabs.Trigger className="tabs-trigger" value="tab2">
            Report Dashboard
          </Tabs.Trigger>
        )}
      </Tabs.List>
      <div>
        <div style={{ display: activeTab === "tab1" ? "block" : "none" }}>
          <OssStigReportsTab />
        </div>

        <div style={{ display: activeTab === "tab2" ? "block" : "none" }}>
          <DashboardTab
            reportData={storedData}
            selectedReportNum={selectedReport}
          />
        </div>
      </div>
    </Tabs.Root>
  );
};

async function fetchReportData() {
  try {
    const filePath = process.env.PUBLIC_URL + 'historicalData.json';
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }

    //const text = await response.text();
    const data = await response.text();
    const reportData = JSON.parse(data);
    // console.log(reportData);
       
   // Ensure each item has a unique key (if not already unique)
   reportData.forEach((item, index) => {
    item.id = item.id || `item-${index}`; // Ensure unique `id`
  });

    return reportData;
  } catch (e) {
    throw e;
  }
}


export default TabsComponent;
