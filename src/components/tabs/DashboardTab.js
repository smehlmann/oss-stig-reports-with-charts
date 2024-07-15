import React, { useState, useEffect } from "react";
// import useLocalStorageListener from "../useLocalStorageListener";
import DashboardSelectedReport5 from "../DashboardLayouts/DashboardSelectedReport5";
import DashboardSelectedReport7 from "../DashboardLayouts/DashboardSelectedReport7";
import DashboardSelectedReport8 from "../DashboardLayouts/DashboardSelectedReport8";
import DashboardSelectedReport14 from "../DashboardLayouts/DashboardSelectedReport14";

import "./DashboardTab.css"
/* Include statement to handle how data is parsed based on the report selected*/

const formatPercentage = (percentageString) => {
  if (!percentageString) {
    return 0; // Return 0 for null or empty values
  }
  const percentageValue = parseFloat(percentageString.replace('%', ''));
  return percentageValue / 100; // Convert to decimal
};

const objectToString = (object) => {
  if (!object) {
    return ''; // or handle empty values as needed
  }
  //split the value by colon and take second part
  const jsonString = JSON.stringify(object);
  return jsonString
};

const stringToDate = (dateString) => {
  if (!dateString) {
    return null; // Return null for null or empty strings
  }

  // Try parsing the date using the known formats
  let date;
  // Attempt to parse using the format YYYY-MM-DD
  date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date; // Return if successful
  }

  // Attempt to parse using the format M/DD/YYYY
  const parts = dateString.split('/');
  if (parts.length === 3) {
    date = new Date(`${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`);
    if (!isNaN(date.getTime())) {
      return date; // Return if successful
    }
  }
  // If parsing fails, return null
  return null;
};

//Only for report 5 (2nd option), split string into array of strings if it contains a space
const convertBenchmarksToArray = (initialString, selectReportNum) => {
  if (selectReportNum === '5') {
    //if initialString contains spaces
    if(initialString.includes(" ")){
      return initialString.split(" ");
    }
    //store in array 
    else {
      return [initialString];
    }
  }
  else {
    return initialString;
  }
};


const formatData = (parsedData, selectedReportNum) => {
  if (!Array.isArray(parsedData)) {
    return [];
  }

  return parsedData.map((entry, index) => {

    //convert pulledDate to date object
    if (entry.datePulled !== undefined) {
      const [year, month, day] = entry.datePulled.split("-");
      entry.datePulled = new Date(year, month - 1, day);
      entry.datePulled = stringToDate(entry.datePulled);
    }
    
    //convert percentage strings to decimals
    if (entry.assessed !== undefined) {
      entry.assessed = formatPercentage(entry.assessed);
    }
    if (entry.submitted !== undefined) {
      entry.submitted = formatPercentage(entry.submitted);
    }
    if (entry.accepted !== undefined) {
      entry.accepted = formatPercentage(entry.accepted);
    }
    if (entry.rejected !== undefined) {
      entry.rejected = formatPercentage(entry.rejected);
    }

    //convert objs to strings
    if (entry.sysAdmin !== undefined) {
      entry.sysAdmin = objectToString(entry.sysAdmin).replace("_$", "");
    }
    if (entry.primOwner !== undefined) {
      entry.primOwner = objectToString(entry.primOwner);
    }
    if (entry.deviceType !== undefined) {
      entry.deviceType = objectToString(entry.deviceType);
    }

    //convert benchmarks to array for report5
    if (entry.benchmarks !== undefined) {
      entry.benchmarks = convertBenchmarksToArray(entry.benchmarks, selectedReportNum);
    }

    if (selectedReportNum === '5' && entry.shortName === "NCCM") {
      entry.shortName = entry.nccm || "NCCM";
    }

    return { ...entry, uniqueId: index }; // Add a unique identifier
  });
};

const DashboardTab = ({reportData, selectedReportNum}) => {
  //parse data from string to array
  let parsedData = typeof reportData == 'string' ? JSON.parse(reportData): reportData;
  const formattedData = formatData(parsedData, selectedReportNum); 

  //keeps track of the selectedReport state
  const [selectedReport, setSelectedReport] = useState(null);

  // console.log("formattedData: ", formattedData);

  const handleClick = (reportNum) =>  {
    setSelectedReport(reportNum);
  }

  // decide which grid layout to display based on report
  switch (selectedReportNum) {
    case '5':
      return <DashboardSelectedReport5 data={formattedData} handleClick={handleClick} />
    case '7':
      return <DashboardSelectedReport7 data={formattedData} handleClick={handleClick} />
    case '8':
      return <DashboardSelectedReport8 data={formattedData} handleClick={handleClick} />
    case '14':
      return <DashboardSelectedReport14 data={formattedData} handleClick={handleClick} />

    default:
      return null
  }    
};

export default DashboardTab;

/*
const DashboardTab = ({reportData}) => {
  
  //parse data from string to array
  let parsedData = typeof reportData == 'string' ? JSON.parse(reportData): reportData;
  console.log('reportData: ' + parsedData);

  return <DashboardLayout data={parsedData} />;
};

export default DashboardTab;
*/


