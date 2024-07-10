import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "../../App.css";
//import './ReportSelection.css';
import { CSVLink } from "react-csv";
import * as GenerateReport from "../../reports/GenerateReport.js";
import ReportColumns from "../ReportColumns";
import { getAuth } from "../../store/index.js";
//import { getReportData } from '../../store/index.js';
import * as reportUtils from "../../reports/reportUtils.js";
import ClipLoader from "react-spinners/ClipLoader";

const OssStigReportsTab = () => {
  const [apiResponse, setApiResponse] = useState([]);
  const [fileData, setFileData] = useState("");
  const [headers, setHeaders] = useState("");
  const [report, setReport] = useState("");
  const [emassNums, setEmassNums] = useState("");
  const [showEmassNum, setShowEmassNums] = useState(false);
  const [showNumDaysOver, setShowNumDaysOver] = useState(false);
  const [numDaysOver, setNumDaysOver] = useState("360");
  const [showData, setShowData] = useState(false);
  const [showNoDataFound, setShowNoDataFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [disableNewReport, setDisableNewReport] = useState(true);
  const [disableCancelReport, setDisableCancelReport] = useState(true);
  const [disableRunReport, setDisableRunReport] = useState(true);

  //localStorage.removeItem("ossStigReport");
  //localStorage.removeItem("selectedReport");

  //var jsonData = null;
  var auth = getAuth();
  const dispatch = useDispatch();

  // clear local storage when the window closes
  window.onbeforeunload = function () {
    localStorage.clear();
  };

  // this function will be called when a radio button is checked
  const onRadioChange = (e) => {
    setReport(e.target.value);
    if (
      e.target.value !== "12" &&
      e.target.value !== "13" &&
      e.target.value !== "14"
    ) {
      setShowEmassNums(true);
    }
    if (e.target.value === "11") {
      setShowNumDaysOver(true);
    }

    setDisableRunReport(false);
  };

  const updateEmass = (event) => {
    // 👇 Get input value from "event"
    setEmassNums(event.target.value);
  };

  const updateNumDaysOver = (event) => {
    // 👇 Get input value from "event"
    setNumDaysOver(event.target.value);
  };

  const newReport = (e) => {
    window.location.reload();
  };

  const cancelReport = (e) => {
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    if (isButtonDisabled === true) {
      return;
    }

    e.preventDefault();

    if (report === "") {
      alert("Please select a report to generate.");
      return;
    }

    if (
      (report === "11" ||
        report === "8" ||
        report === "9" ||
        report === "13") &&
      emassNums === ""
    ) {
      alert("You must enter EMASS number(s)");
      return;
    }

    if (report === "11" && numDaysOver === "") {
      alert("You must enter the number of days over.");
      return;
    }

    setLoading(true);
    setButtonDisabled(true);
    setDisableRunReport(true);
    setDisableNewReport(true);
    setDisableCancelReport(false);

    await callAPI(auth, report, emassNums, numDaysOver).then((data) => {
      if (report !== "14") {
        if (data && data.rows && data.rows.length > 0) {
          var mergedData = reportUtils.mergeHeadersAndData(data);
          //setApiResponse(data.rows);
          setApiResponse(mergedData);
          setFileData(data.rows);
          setHeaders(data.headers);
          setShowData(true);
          var reportData = dispatch({
            type: "refresh-reportData",
            reportData: data.rows,
          });
          if (reportData) {
            console.log("reportData found");
            localStorage.setItem("ossStigReport", JSON.stringify(data.rows));
            localStorage.setItem("selectedReport", report);
            window.dispatchEvent(new Event("storage"));
          }
        } else {
          setShowNoDataFound(true);
          setDisableCancelReport(true);
        }
      } else {
        /* logic for historical data*/
        localStorage.setItem("selectedReport", report);
        window.dispatchEvent(new Event("storage"));
        setShowData(false);
        setDisableCancelReport(true);
      }
    });

    setLoading(false);
    setButtonDisabled(true);
    setDisableNewReport(false);
    //setDisableNewReport(false);
    setDisableCancelReport(true);
  };

  // error handling for if auth is null/undefined or userData doesn't exist
  if (auth && auth.userData) {
    return (
      <div>
        <div id="mySpinner">
          <ClipLoader
            loading={loading}
            size={150}
            aria-label="Generating Report"
            data-testid="loader"
          />
        </div>
        <div className="title-div">
          <strong className="title">Select Report</strong>
        </div>
        <div>
          <div className="radio-btn-container-div">
            <form onSubmit={handleSubmit}>
              <label>
                <input
                  type="radio"
                  value="1"
                  checked={report === "1"}
                  onChange={onRadioChange}
                  disabled={isButtonDisabled}
                />
                <span>1. RMF SAP Report</span>
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  value="5"
                  checked={report === "5"}
                  onChange={onRadioChange}
                  disabled={isButtonDisabled}
                />
                <span>
                  2. Asset Collection per Primary Owner and System Admin
                </span>
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  value="7"
                  checked={report === "7"}
                  onChange={onRadioChange}
                  disabled={isButtonDisabled}
                />
                <span>3. Asset Status per eMASS</span>
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  value="8"
                  checked={report === "8"}
                  onChange={onRadioChange}
                  disabled={isButtonDisabled}
                />
                <span>
                  4. STIG Deltas per Primary Owner and System Admin (EMASS
                  number(s) required)
                </span>
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  value="9"
                  checked={report === "9"}
                  onChange={onRadioChange}
                  disabled={isButtonDisabled}
                />
                <span>
                  5. STIG Benchmark By Results (EMASS number(s) required)
                </span>
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  value="11"
                  checked={report === "11"}
                  onChange={onRadioChange}
                  disabled={isButtonDisabled}
                />
                <span>
                  6. Checklist Over 356 Days (EMASS number(s) required)
                </span>
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  value="12"
                  checked={report === "12"}
                  onChange={onRadioChange}
                  disabled={isButtonDisabled}
                />
                <span>7. STIG Deltas for Unidentified NCCM Packages</span>
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  value="13"
                  checked={report === "13"}
                  onChange={onRadioChange}
                  disabled={isButtonDisabled}
                />
                <span>8. Pinned Report (EMASS number(s) required)</span>
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  value="14"
                  checked={report === "14"}
                  onChange={onRadioChange}
                  disabled={isButtonDisabled}
                />
                <span>9. Display Historical Data</span>
              </label>
              <br />
              <br />
              {showEmassNum && (
                <div id="emassDiv">
                  <label htmlFor="emassNumsText">
                    Required for reports 4, 5, 9. Optional for all others.
                    <br /> Enter EMASS Number(s) separated by commas:{" "}
                  </label>
                  <input
                    id="emassNumsText"
                    type="text"
                    value={emassNums}
                    onChange={updateEmass}
                    disabled={isButtonDisabled}
                  />
                </div>
              )}
              <br />
              {showNumDaysOver && (
                <div>
                  <label htmlFor="emassNumsText">
                    Enter number of days over:{" "}
                  </label>
                  <input
                    id="numDaysText"
                    type="number"
                    value={numDaysOver}
                    onChange={updateNumDaysOver}
                    disabled={isButtonDisabled}
                  />
                </div>
              )}
              <br />
              <button
                className="submit-btn"
                type="submit"
                disabled={disableRunReport}
              >
                Run Report
              </button>
              <button
                className="cancel-report-btn"
                type="reset"
                onClick={cancelReport}
                disabled={disableCancelReport}
              >
                Cancel Report
              </button>
              <button
                className="new-report-btn"
                type="reset"
                onClick={newReport}
                disabled={disableNewReport}
              >
                New Report
              </button>
              <br />
              <br />
              {showNoDataFound && (
                <div className="title-div">
                  <strong className="title">
                    No data matching your selection found.
                  </strong>
                </div>
              )}
              {showData && (
                <div id="tableDiv">
                  <div id="csv-ink-div">
                    <CSVLink
                      data={fileData}
                      headers={headers}
                      onClick={() => {
                        //window.location.reload();
                      }}
                    >
                      Export report to CSV file.
                    </CSVLink>
                  </div>
                  <br />
                  <br />
                  <div>
                    <table>
                      <tbody>
                        {apiResponse.map((item, index) => (
                          <ReportColumns
                            index={index}
                            item={item}
                            selectedReport={report}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
};

async function callAPI(auth, report, emassNums, numDaysOver) {
  //alert('callAPI report: ' + report);

  var rows;

  if (report !== "14") {
    rows = await GenerateReport.GenerateReport(
      auth,
      report,
      emassNums,
      numDaysOver
    );

    //alert('calApi number of rows retruned: ' + rows.length);
  }

  return rows;
}

export default OssStigReportsTab;
