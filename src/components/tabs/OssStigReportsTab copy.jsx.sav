import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import '../../App.css';
import { CSVLink } from 'react-csv';
import * as GenerateReport from '../../reports/GenerateReport.js';
import ReportColumns from '../ReportColumns';
import { getAuth } from '../../store/index.js';
import { getReportData } from '../../store/index.js';
import * as reportUtils from '../../reports/reportUtils.js';

const OssStigReportsTab = () => {

  const [apiResponse, setApiResponse] = useState([]);
  const [fileData, setFileData] = useState('');
  const [headers, setHeaders] = useState('');
  const [report, setReport] = useState('');
  const [emassNums, setEmassNums] = useState('');
  const [showEmassNum, setShowEmassNums] = useState(false);
  const [showNumDaysOver, setShowNumDaysOver] = useState(false);
  const [numDaysOver, setNumDaysOver] = useState('360');
  const [showData, setShowData] = useState(false);
  const [showNoDataFound, setShowNoDataFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [disableNewReport, setDisableNewReport] = useState(false);

  //var jsonData = null;
  var auth = getAuth();
  const dispatch = useDispatch();

  // this function will be called when a radio button is checked
  const onRadioChange = (e) => {
    setReport(e.target.value);
    //setShowEmassNums(true);
    if (e.target.value !== '12') {
      setShowEmassNums(true);
    }
    if (e.target.value === '11') {
      setShowNumDaysOver(true);
    }
  }

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
  }

  const cancelReport = (e) => {

    window.location.reload();
  }

  const handleSubmit = async (e) => {


    if (isButtonDisabled === true) {
      return;
    }

    e.preventDefault();

    if (report === '') {
      alert('Please select a report to generate.');
      return;
    }

    if ((report === '11' || report === '8' || report === '9') && emassNums === '') {
      alert('You must enter EMASS number(s)');
      return;
    }

    if (report === '11' && numDaysOver === '') {
      alert('You must enter the number of days over.');
      return;
    }

    setLoading(true);
    setButtonDisabled(true);
    setDisableNewReport(true);

    await callAPI(auth, report, emassNums, numDaysOver).then((data) => {

      if (data && data.rows.length > 0) {
        var mergedData = reportUtils.mergeHeadersAndData(data);
        //setApiResponse(data.rows);
        setApiResponse(mergedData);
        setFileData(data.rows);
        setHeaders(data.headers);
        setShowData(true);
        var reportData = dispatch({ type: 'refresh-reportData', reportData: data.rows });
        if(reportData){
          console.log('reportData found');
          const myData = getReportData ();
          localStorage.setItem('ossStigReport', JSON.stringify(data.rows));
        }
      }
      else {
        setShowNoDataFound(true);
      }
    });

    setLoading(false);
    setButtonDisabled(true);
    setDisableNewReport(false);

  }

  // error handling for if auth is null/undefined or userData doesn't exist
  if (auth && auth.userData) {
    return (
      <div>
        <div className="title-div">
          <strong className="title">Select Report</strong>
        </div>
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
              <span>2. Asset Collection per Primary Owner and System Admin</span>
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
              <span>4. STIG Deltas per Primary Owner and System Admin (EMASS number(s) required)</span>
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
              <span>5. STIG Benchmark By Results (EMASS number(s) required)</span>
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
              <span>6. Checklist Over 356 Days (EMASS number(s) required)</span>
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
            <br /><br />
            {showEmassNum && (
              <div id='emassDiv'>
                <label htmlFor="emassNumsText">Optional for reports 1-5 and 8. Required for reports 6, 7 and 9.<br /> Enter EMASS Number(s) separated by commas: </label>
                <input
                  id='emassNumsText'
                  type='text'
                  value={emassNums}
                  onChange={updateEmass}
                  disabled={isButtonDisabled}
                />
              </div>
            )}
            <br />
            {showNumDaysOver && (
              <div>
                <label htmlFor="emassNumsText">Enter number of days over: </label>
                <input
                  id='numDaysText'
                  type='number'
                  value={numDaysOver}
                  onChange={updateNumDaysOver}
                  disabled={isButtonDisabled}
                />
              </div>
            )}
            <br />
            <button className="submit-btn" type="submit" disabled={isButtonDisabled}>Run Report</button>
            <button className="cancel-report-btn" type='reset' onClick={cancelReport} disabled={false}>Canecl Report</button>
            <button className="new-report-btn" type='reset' onClick={newReport} disabled={disableNewReport}>New Report</button>
            <br /><br />
            {showNoDataFound && (
              <div className="title-div">
                <strong className="title">No data matching your selection found.</strong>
              </div>
            )}
            {showData && (
              <div id='tableDiv'>
                <div id="csv-ink-div">
                  <CSVLink
                    data={fileData}
                    headers={headers}
                    onClick={() => {
                      //window.location.reload();
                    }}
                  >Export report to CSV file.</CSVLink>
                </div>
                <br /><br />
                <div>
                  <table>
                    <tbody>
                      {apiResponse.map((item, index) => (
                        <ReportColumns index={index} item={item} selectedReport={report} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </form>
        </div>
      </div >
    );
  }
}

async function callAPI(auth, report, emassNums, numDaysOver) {

  //alert('callAPI report: ' + report);

  var rows = await GenerateReport.GenerateReport(auth, report, emassNums, numDaysOver);
  //alert('calApi number of rows retruned: ' + rows.length);

  return rows;
}


export default OssStigReportsTab;