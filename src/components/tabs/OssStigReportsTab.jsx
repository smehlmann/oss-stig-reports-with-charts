import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "../../App.css";
import { CSVLink } from "react-csv";
import * as GenerateReport from "../../reports/GenerateReport.js";
import ReportColumns from "./ReportColumns.jsx";
import { getAuth } from "../../store/index.js";
import * as reportUtils from "../../reports/reportUtils.js";
import ClipLoader from "react-spinners/ClipLoader";
import * as DialogMessages from "./DialogMessages.jsx";
import { IconButton, Alert, Dialog, DialogContent } from "@mui/material";
import { Info } from "@mui/icons-material";
import Button from "@mui/material/Button";
import SelectionDropdownList from "../dropdowns/SelectionDropdownList.js";
import {
  emassNumsList,
  maxNumEmassSelections,
} from "../dropdowns/emassNumConstants.js";

const OssStigReportsTab = () => {
  const [apiResponse, setApiResponse] = useState([]);
  const [fileData, setFileData] = useState("");
  const [headers, setHeaders] = useState("");
  const [report, setReport] = useState("");
  const [emassNums, setEmassNums] = useState("");
  const [showEmassNum, setShowEmassNums] = useState(false);
  const [benchmark, setBenchmark] = useState("");
  const [showBenchmark, setShowBenchmark] = useState(false);
  const [showNumDaysOver, setShowNumDaysOver] = useState(false);
  const [numDaysOver, setNumDaysOver] = useState("360");
  const [showData, setShowData] = useState(false);
  const [showNoDataFound, setShowNoDataFound] = useState(false);
  const [showNoPinnedDataFound, setShowNoPinnedDataFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [disableNewReport, setDisableNewReport] = useState(true);
  const [disableCancelReport, setDisableCancelReport] = useState(true);
  const [disableRunReport, setDisableRunReport] = useState(true);
  const [selectedEmassNum, setSelectedEmassNum] = useState([]);

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [open6, setOpen6] = useState(false);
  //const [open7, setOpen7] = useState(false);
  const [open8, setOpen8] = useState(false);
  const [open9, setOpen9] = useState(false);
  const [option, setOption] = useState("");

  var auth = getAuth();
  const dispatch = useDispatch();

  // clear local storage when the window closes
  window.onbeforeunload = function () {
    localStorage.clear();
  };

  const handleEmassSelectionChange = (chosenEmass, emass) => {
    var emassStr = "";
    if (chosenEmass && chosenEmass.length > 0) {
      if (chosenEmass.length > maxNumEmassSelections) {
        alert("A maximim of " + maxNumEmassSelections + "can be selected.");
        return;
      }
      for (var iChosen = 0; iChosen < chosenEmass.length; iChosen++) {
        var tmpStrs = chosenEmass[iChosen].split(" ");
        emassStr = emassStr + tmpStrs[0] + ",";
      }
      //emassStr = chosenEmass.join(",")
      emassStr = emassStr.replace(/,\s*$/, "");
    }

    console.log("eMASS: " + emassStr);
    setEmassNums(emassStr);
    setSelectedEmassNum(chosenEmass);
    console.log("eMASS numbers: " + emassNums);
  };

  // this function will be called when a radio button is checked
  const onRadioChange = (e) => {
    setReport(e.target.value);
    if (e.target.value !== "12" && e.target.value !== "14") {
      setShowEmassNums(true);
    }
    if (e.target.value === "9") {
      setShowBenchmark(true);
    } else {
      setShowBenchmark(false);
    }
    if (e.target.value === "11") {
      setShowNumDaysOver(true);
      alert("Report 6 may take an hour or more to complete.");
    } else {
      setShowNumDaysOver(false);
    }

    setDisableRunReport(false);
  };

  /*const handleTokenExpiring = () => {
    console.log("Access token expiring event fired");
    console.log(auth.userData);

    // set the new auth value in the data store
    dispatch({ type: "refresh", auth: auth });

    extendSession();
    //setAccessTokenId(auth.userData?.access_token);
  };*/

  const updateBenchmark = (event) => {
    // 👇 Get input value from "event"
    setBenchmark(event.target.value);
  };

  const updateNumDaysOver = (event) => {
    // 👇 Get input value from "event"
    setNumDaysOver(event.target.value);
  };

  const newReport = (e) => {
    window.location.reload();
    //handleTokenExpiring();
  };

  const cancelReport = (e) => {
    window.location.reload();
    //handleTokenExpiring();
  };

  const handleInfoClick = (event) => {
    console.log(event);
    console.log(event.currentTarget.attributes.option.nodeValue);
    //alert("Info icon clicked!");
    const option = event.currentTarget.attributes.option.nodeValue;
    setOption(option);
    setOpen1(true);
    setOpen2(false);
    setOpen3(false);
    setOpen4(false);
    setOpen5(false);
    setOpen6(false);
    setOpen8(false);
    setOpen9(false);
    switch (option) {
      case "report1":
        setOpen1(true);
        break;
      case "report2":
        setOpen2(true);
        break;
      case "report3":
        setOpen3(true);
        break;
      case "report4":
        setOpen4(true);
        break;
      case "report5":
        setOpen5(true);
        break;
      case "report6":
        setOpen6(true);
        break;
      case "report8":
        setOpen8(true);
        break;
      case "report9":
        setOpen9(true);
        break;
      default:
    }
    //setAnchorEl(event.currentTarget);
  };

  const handleInfoClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    switch (option) {
      case "report1":
        setOpen1(false);
        break;
      case "report2":
        setOpen2(false);
        break;
      case "report3":
        setOpen3(false);
        break;
      case "report4":
        setOpen4(false);
        break;
      case "report5":
        setOpen5(false);
        break;
      case "report6":
        setOpen6(false);
        break;
      case "report8":
        setOpen8(false);
        break;
      case "report9":
        setOpen9(false);
        break;
      default:
    }
    //setAnchorEl(null);
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
      alert("You must enter eMASS number(s)");
      return;
    }
    /*if ((report === "8" || report === "9") && benchmark === "") {
      alert("You must enter Benchmark ID");
      return;
    }*/

    if (report === "11" && numDaysOver === "") {
      alert("You must enter the number of days over.");
      return;
    }

    setLoading(true);
    setButtonDisabled(true);
    setDisableRunReport(true);
    setDisableNewReport(true);
    setDisableCancelReport(false);

    await callAPI(auth, report, emassNums, numDaysOver, benchmark).then(
      (data) => {
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
              //localStorage.setItem("ossStigReport", JSON.stringify(data.rows));

              //var fileName = saveReportData(reportData);
              localStorage.setItem("selectedReport", report);
              //localStorage.setItem("reportDataFile", fileName);
              window.dispatchEvent(new Event("storage"));
            }
          } else {
            if (report === "13") {
              setShowNoPinnedDataFound(true);
            } else {
              setShowNoDataFound(true);
            }
            setDisableCancelReport(true);
          }
        } else {
          /* logic for historical data*/
          localStorage.setItem("selectedReport", report);
          window.dispatchEvent(new Event("storage"));
          setShowData(false);
          setDisableCancelReport(true);
        }
      }
    );

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
                <IconButton
                  option="report1"
                  onClick={handleInfoClick}
                  size="small"
                  style={{ marginLeft: 4 }}
                >
                  <Info fontSize="small" />
                </IconButton>
                <Dialog
                  open={open1}
                  onClose={handleInfoClose}
                  fullWidth
                  maxWidth="md"
                  PaperProps={{
                    sx: {
                      position: "absolute",
                      top: 0,
                      margin: 5,
                    },
                  }}
                >
                  <DialogContent>
                    <Alert
                      onClose={handleInfoClose}
                      severity="info"
                      sx={{ width: "100%" }}
                    >
                      <DialogMessages.Report1DialogMessage />
                    </Alert>
                    <Button onClick={handleInfoClose} color="primary">
                      Close
                    </Button>
                  </DialogContent>
                </Dialog>
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
                <span>2. Asset Metrics</span>
                <IconButton
                  option="report2"
                  onClick={handleInfoClick}
                  size="small"
                  style={{ marginLeft: 4 }}
                >
                  <Info fontSize="small" />
                </IconButton>
                <Dialog
                  open={open2}
                  onClose={handleInfoClose}
                  fullWidth
                  maxWidth="md"
                  PaperProps={{
                    sx: {
                      position: "absolute",
                      top: 0,
                      margin: 5,
                    },
                  }}
                >
                  <DialogContent>
                    <Alert
                      onClose={handleInfoClose}
                      severity="info"
                      sx={{ width: "100%" }}
                    >
                      <DialogMessages.Report2DialogMessage />
                    </Alert>
                    <Button onClick={handleInfoClose} color="primary">
                      Close
                    </Button>
                  </DialogContent>
                </Dialog>
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
                <span>3. RMF Package Asset Count </span>
                <IconButton
                  option="report3"
                  onClick={handleInfoClick}
                  size="small"
                  style={{ marginLeft: 4 }}
                >
                  <Info fontSize="small" />
                </IconButton>
                <Dialog
                  open={open3}
                  onClose={handleInfoClose}
                  fullWidth
                  maxWidth="md"
                  PaperProps={{
                    sx: {
                      position: "absolute",
                      top: 0,
                      margin: 5,
                    },
                  }}
                >
                  <DialogContent>
                    <Alert
                      onClose={handleInfoClose}
                      severity="info"
                      sx={{ width: "100%" }}
                    >
                      <DialogMessages.Report3DialogMessage />
                    </Alert>
                    <Button onClick={handleInfoClose} color="primary">
                      Close
                    </Button>
                  </DialogContent>
                </Dialog>
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
                  4. STIG Benchmark Version Deltas (eMASS number(s) required)
                </span>
                <IconButton
                  option="report4"
                  onClick={handleInfoClick}
                  size="small"
                  style={{ marginLeft: 4 }}
                >
                  <Info fontSize="small" />
                </IconButton>
                <Dialog
                  open={open4}
                  onClose={handleInfoClose}
                  fullWidth
                  maxWidth="md"
                  PaperProps={{
                    sx: {
                      position: "absolute",
                      top: 0,
                      margin: 5,
                    },
                  }}
                >
                  <DialogContent>
                    <Alert
                      onClose={handleInfoClose}
                      severity="info"
                      sx={{ width: "100%" }}
                    >
                      <DialogMessages.Report4DialogMessage />
                    </Alert>
                    <Button onClick={handleInfoClose} color="primary">
                      Close
                    </Button>
                  </DialogContent>
                </Dialog>
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
                  5. Open Result Finding Metrics (eMASS number(s) required)
                </span>
                <IconButton
                  option="report5"
                  onClick={handleInfoClick}
                  size="small"
                  style={{ marginLeft: 4 }}
                >
                  <Info fontSize="small" />
                </IconButton>
                <Dialog
                  open={open5}
                  onClose={handleInfoClose}
                  fullWidth
                  maxWidth="md"
                  PaperProps={{
                    sx: {
                      position: "absolute",
                      top: 0,
                      margin: 5,
                    },
                  }}
                >
                  <DialogContent>
                    <Alert
                      onClose={handleInfoClose}
                      severity="info"
                      sx={{ width: "100%" }}
                    >
                      <DialogMessages.Report5DialogMessage />
                    </Alert>
                    <Button onClick={handleInfoClose} color="primary">
                      Close
                    </Button>
                  </DialogContent>
                </Dialog>
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
                  6. Checks Not Updated in x Days (eMASS number(s) required){" "}
                  <b>NOTE: may take an hour or more to complete.</b>
                </span>
                <IconButton
                  option="report6"
                  onClick={handleInfoClick}
                  size="small"
                  style={{ marginLeft: 4 }}
                >
                  <Info fontSize="small" />
                </IconButton>
                <Dialog
                  open={open6}
                  onClose={handleInfoClose}
                  fullWidth
                  maxWidth="md"
                  PaperProps={{
                    sx: {
                      position: "absolute",
                      top: 0,
                      margin: 5,
                    },
                  }}
                >
                  <DialogContent>
                    <Alert
                      onClose={handleInfoClose}
                      severity="info"
                      sx={{ width: "100%" }}
                    >
                      <DialogMessages.Report6DialogMessage />
                    </Alert>
                    <Button onClick={handleInfoClose} color="primary">
                      Close
                    </Button>
                  </DialogContent>
                </Dialog>
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
                <span>7. Pinned Revisions (eMASS number(s) required)</span>
                <IconButton
                  option="report8"
                  onClick={handleInfoClick}
                  size="small"
                  style={{ marginLeft: 4 }}
                >
                  <Info fontSize="small" />
                </IconButton>
                <Dialog
                  open={open8}
                  onClose={handleInfoClose}
                  fullWidth
                  maxWidth="md"
                  PaperProps={{
                    sx: {
                      position: "absolute",
                      top: 0,
                      margin: 5,
                    },
                  }}
                >
                  <DialogContent>
                    <Alert
                      onClose={handleInfoClose}
                      severity="info"
                      sx={{ width: "100%" }}
                    >
                      <DialogMessages.Report8DialogMessage />
                    </Alert>
                    <Button onClick={handleInfoClose} color="primary">
                      Close
                    </Button>
                  </DialogContent>
                </Dialog>
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
                <span>8. Historical Data</span>
                <IconButton
                  option="report9"
                  onClick={handleInfoClick}
                  size="small"
                  style={{ marginLeft: 4 }}
                >
                  <Info fontSize="small" />
                </IconButton>
                <Dialog
                  open={open9}
                  onClose={handleInfoClose}
                  fullWidth
                  maxWidth="md"
                  PaperProps={{
                    sx: {
                      position: "absolute",
                      top: 0,
                      margin: 5,
                    },
                  }}
                >
                  <DialogContent>
                    <Alert
                      onClose={handleInfoClose}
                      severity="info"
                      sx={{ width: "100%" }}
                    >
                      <DialogMessages.Report9DialogMessage />
                    </Alert>
                    <Button onClick={handleInfoClose} color="primary">
                      Close
                    </Button>
                  </DialogContent>
                </Dialog>
              </label>
              <br />
              <br />
              {showEmassNum && (
                <div id="emassDiv">
                  <label htmlFor="emassNumsText">
                    Required for reports 4, 5, 6, 8. Optional for all others.
                    <br /> Select eMASS Number(s) from the dropdown list.:{" "}
                  </label>
                  <div id="emassDropdown">
                    <SelectionDropdownList
                      targetProperty="emass"
                      selectedOptions={selectedEmassNum}
                      valueOptions={emassNumsList}
                      onChange={handleEmassSelectionChange}
                      selectAllOptionsFlag={false}
                      limitNumOfTags={false}
                    />
                  </div>
                </div>
              )}
              {showBenchmark && (
                <div id="benchmarkDiv">
                  <label htmlFor="benchmarkText">
                    <br /> Optional: Enter Benchmark ID:{" "}
                  </label>
                  <input
                    id="benchmarkText"
                    type="text"
                    value={benchmark}
                    onChange={updateBenchmark}
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
              {showNoPinnedDataFound && (
                <div className="title-div">
                  <strong className="title">
                    "eMASS entered has no pinned revisions.
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

async function callAPI(auth, report, emassNums, numDaysOver, benchmark) {
  //alert('callAPI report: ' + report);

  var rows;

  try {
    if (report !== "14") {
      rows = await GenerateReport.GenerateReport(
        auth,
        report,
        emassNums,
        numDaysOver,
        benchmark
      );

      //alert('calApi number of rows retruned: ' + rows.length);
    }
  } catch (e) {
    console.log("callAPI: " + e);
  }

  return rows;
}

export default OssStigReportsTab;
