import React, { useState, useEffect } from "react";
import OssStigReportsTab from "./OssStigReportsTab";
import DashboardTab from "./DashboardTab";
import "./TabComponentStyles.css";
import useLocalStorageListener from "../useLocalStorageListener.js";

import * as Tabs from "@radix-ui/react-tabs";

const TabsComponent = () => {
  //const [selectedIndex, setSelectedIndex] = useState(0);

  /*const handleTabChange = (index) => {
    setSelectedIndex(index);
    console.log('selectedIndex: ' + selectedIndex);
  };*/

  const [activeTab, setActiveTab] = useState("tab1");

  /*const handleTabClick = (value) => {
    console.log("Tab clicked!", value);
    setActiveTab(value);
  };*/

  const [disableDashboard, setDisableDashboard] = useState(true);

  useEffect(() => {
    console.log("BarChartBuilder from useEffect");
    if (localStorage.getItem("ossStigReport")) {
      setDisableDashboard(false);
    }
  }, []);

  useLocalStorageListener((event) => {
    console.log("hi from useLocalStorageListener");
    if (event.type === "storage") {
      console.log("hi from useLocalStorageListener");
      /*if (localStorage.getItem("ossStigReport")) {
        setDisableDashboard(false);
      } else {
        setDisableDashboard(true);
      }*/
      if (localStorage.getItem("ossStigReport")) {
        const selectedReport = localStorage.getItem("selectedReport");
        if (
          selectedReport === "5" ||
          selectedReport === "7" ||
          selectedReport === "8"
        ) {
          setDisableDashboard(false);
        } else {
          setDisableDashboard(true);
        }
      } else {
        setDisableDashboard(true);
      }
    }
  });

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

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
          <DashboardTab />
        </div>
      </div>
    </Tabs.Root>
  );
};

export default TabsComponent;
