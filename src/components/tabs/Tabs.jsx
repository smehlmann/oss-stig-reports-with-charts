import React, { useState } from "react";
import OssStigReportsTab from "./OssStigReportsTab";
import DashboardTab from "./DashboardTab";
import ClipLoader from "react-spinners/ClipLoader";

const Tabs = () => {

    const [activeTab, setActiveTab] = useState("tab1");
    const loading = false;

    //  Functions to handle Tab Switching
    const handleTab1 = () => {
        // update the state to tab1
        setActiveTab("tab1");
    };

    const handleTab2 = () => {
        // update the state to tab2
        setActiveTab("tab2");
    };


    return (
        <div id='banner'>
            <div className="Charts">
                <div id="banner-content">
                    UNCLASSIFIED (U)
                </div>
            </div>
            <div id="mySpinner">
                <ClipLoader
                    loading={loading}
                    size={150}
                    aria-label="Generating Report"
                    data-testid="loader"
                />
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
                    {activeTab === "tab1" ? <OssStigReportsTab /> : <DashboardTab />}
                </div>
            </div>
        </div>
    );
};

export default Tabs;