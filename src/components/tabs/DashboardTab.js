import React, { useState, useEffect } from "react";
// import useLocalStorageListener from "../useLocalStorageListener";
import DashboardSelectedReport5 from "../DashboardLayouts/DashboardSelectedReport5";
import DashboardSelectedReport7 from "../DashboardLayouts/DashboardSelectedReport7";
import DashboardSelectedReport8 from "../DashboardLayouts/DashboardSelectedReport8";
import DashboardSelectedReport14 from "../DashboardLayouts/DashboardSelectedReport14";
import { parseISO } from 'date-fns';

import "./DashboardTab.css"
/* Include statement to handle how data is parsed based on the report selected*/

const formatPercentage = (percentageString) => {
  if (!percentageString) {
    return 0; // Return 0 for null or empty values
  }
  percentageString = percentageString.replace('%', '');
  const percentageValue = parseFloat(percentageString);
  return percentageValue / 100; // Convert to decimal
};


const objectToString = (object) => {
  if (!object) {
    return ''; // or handle empty values as needed
  }
  //split the value by colon and take second part
  return JSON.stringify(object)
    .replace(/\\/g, '') // Remove backslashes
    .replace(/^"|"$/g, ''); // Remove quotes at the start and end
};


const stringToDate = (dateString) => {
  if (!dateString) {
    return null; ///return null
  }

  try {
    const date = parseISO(dateString); //parses 8601 date string (YYYY-MM-DD) correctly
    return date;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

//convert from string to numerical:
const stringToNumeric = (stringNum) => {
  stringNum = Number(stringNum);
  return stringNum;
};

//convert num to string
const numToString = (num) => {
  let stringVer = String(num);
  return stringVer;
}

//Only for report 5 (2nd option), split string into array of strings if it contains a space
const convertBenchmarksToArray = (initialString, selectReportNum) => {
  if (selectReportNum === '5' || selectReportNum === '14') {
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
    if (typeof entry.datePulled !== 'undefined' && entry.datePulled !== null) {
      if (typeof entry.datePulled !== 'string') {
        entry.datePulled = objectToString(entry.datePulled);
      }
      entry.datePulled = stringToDate(entry.datePulled);
      // console.log('type: ', entry.datePulled instanceof Date)
      // console.log("datePulled after: ", entry.datePulled);
      // console.log("type for datePulled after: ", typeof entry.datePulled);
    }
    
    //convert percentage strings to decimals
    if (entry.assessed !== 'undefined') {
      if (typeof entry.assessed === 'string') {
        entry.assessed = formatPercentage(entry.assessed);
      }
    }
    if (entry.submitted !== 'undefined') {
      if (typeof entry.submitted === 'string') {
        entry.submitted = formatPercentage(entry.submitted);
      }
    }
    if (entry.accepted !== 'undefined') {
      if (typeof entry.accepted === 'string') {
        entry.accepted = formatPercentage(entry.accepted);
      }
    }
    if (entry.rejected !== 'undefined') {
      if (typeof entry.rejected === 'string') {
        entry.rejected = formatPercentage(entry.rejected);
      }
    }

    //convert objs to strings
    if (entry.sysAdmin !== 'undefined' && entry.sysAdmin !== null) {
      if (entry.sysAdmin !== 'string') {
        entry.sysAdmin = objectToString(entry.sysAdmin).replace("_$", "");
      }
      entry.sysAdmin = entry.sysAdmin.replace("_$", "");
    }
    if (entry.primOwner !== 'undefined' && entry.primOwner !== null) {
      if (entry.primOwner !== 'string') {
        entry.primOwner = objectToString(entry.primOwner).replace("_$", "");
      }
    }
    if (entry.deviceType !== 'undefined' && entry.deviceType !== null) {
      if (entry.deviceType !== 'string') {
        entry.deviceType = objectToString(entry.deviceType).replace("_$", "");
      }
    }


    //convert cat1, cat2 and cat3 to numberic
    if (entry.cat1 !== 'undefined') {
      if (typeof entry.cat1 === 'object') {
        entry.cat1 = objectToString(entry.cat1); //convert to string if not already one
      }
      entry.cat1 = stringToNumeric(entry.cat1);
    }
    if (entry.cat2 !== 'undefined') {
      if (typeof entry.cat2 === 'object') {
        entry.cat2 = objectToString(entry.cat2);
      }
      entry.cat2 = stringToNumeric(entry.cat2);
    }
    if (entry.cat3 !== 'undefined') {
      if (typeof entry.cat3 === 'object') {
        entry.cat3 = objectToString(entry.cat3); 
      }
      entry.cat3 = stringToNumeric(entry.cat3);
    }

    //convert emass and code to strings 
    if (entry.emass !== 'undefined')
    {
      if (entry.emass !== 'string') {
        entry.emass = numToString(entry.emass)
      }
    }
    if (entry.code !== 'undefined') {
      if (entry.code !== 'string') {
        entry.code = numToString(entry.code)
      }
    }
    //convert benchmarks to array for report5
    if (entry.benchmarks !== 'undefined') {
      entry.benchmarks = convertBenchmarksToArray(entry.benchmarks, selectedReportNum);
    }

    if ((selectedReportNum === '5' || selectedReportNum === '14') && entry.shortName === "NCCM") {
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


