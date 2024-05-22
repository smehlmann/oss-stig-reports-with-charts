import React, { useState } from "react";
import OssStigReportsTab from "./OssStigReportsTab";
import DashboardTab from "./DashboardTab";
import './TabComponentStyles.css'

import * as Tabs from "@radix-ui/react-tabs";

const TabsComponent = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  /*const handleTabChange = (index) => {
    setSelectedIndex(index);
    console.log('selectedIndex: ' + selectedIndex);
  };*/

  const [activeTab, setActiveTab] = useState("tab1");

  /*const handleTabClick = (value) => {
    console.log("Tab clicked!", value);
    setActiveTab(value);
  };*/

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <Tabs.Root defaultValue="tab1" className='tabs-root' onValueChange={handleTabChange}>
      <Tabs.List aria-label="Tabs" className='tabs-list'>
        <Tabs.Trigger className='tabs-trigger' value="tab1">Report Generator</Tabs.Trigger>
        <Tabs.Trigger className='tabs-trigger' value="tab2">Report Dashboard</Tabs.Trigger>
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
