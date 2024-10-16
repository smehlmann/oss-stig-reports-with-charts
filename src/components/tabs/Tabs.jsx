import React, { useState } from "react";
import OssStigReportsTab from "./OssStigReportsTab";
import DashboardTab from "./DashboardTab";

const Tabs = () => {

    const [activeTab, setActiveTab] = useState("tab1");
    const [isDashboardEnabled, setDashboardEnabled] = useState(false);

    //  Functions to handle Tab Switching
    const handleTab1 = () => {
        // update the state to tab1
        setActiveTab("tab1");
        setDashboardEnabled(false);
    };

    const handleTab2 = () => {
        if (isDashboardEnabled) {
            // update the state to tab2
            setActiveTab("tab2");
        }
    };

    return (
        <div id='banner'>
            <div className="Charts">
                <div id="banner-content">
                    UNCLASSIFIED (U)
                </div>
            </div>
            <div className="Tabs">
                <ul className="nav">

                    <li
                        className={activeTab === "tab1" ? "active" : ""}
                        onClick={handleTab1}
                    >
                        Generate STIG Reports
                    </li>

                    <li
                        className={activeTab === "tab2" ? "active" : ""}
                        onClick={handleTab2}
                    >
                        Display Charts
                    </li>
                </ul>

                <div className="outlet">
                    {activeTab === "tab1" ? <OssStigReportsTab setDashboardEnabled={setDashboardEnabled}/> : <DashboardTab />}
                </div>
            </div>
        </div>
    );
};

export default Tabs;