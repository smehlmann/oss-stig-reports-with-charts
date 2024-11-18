// import React, { useState, useMemo, useCallback, useEffect} from "react";
import React, { useState, useMemo, useCallback} from "react";

// import useLocalStorageListener from "../useLocalStorageListener";
import DashboardSelectedReport5 from "../DashboardLayouts/DashboardSelectedReport5";
import DashboardSelectedReport7 from "../DashboardLayouts/DashboardSelectedReport7";
import DashboardSelectedReport8 from "../DashboardLayouts/DashboardSelectedReport8";
import DashboardSelectedReport9 from "../DashboardLayouts/DashboardSelectedReport9";
import DashboardSelectedReport14 from "../DashboardLayouts/DashboardSelectedReport14";
import DashboardSelectedReport11 from "../DashboardLayouts/DashboardSelectedReport11";
import DashboardSelectedReport15 from "../DashboardLayouts/DashboardSelectedReport15";
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

//Only for report5 and historical, split string into array of strings if it contains a space
const convertBenchmarksToArray = (initialString, selectReportNum) => {
  if (selectReportNum === '5' || selectReportNum === '14') {
    //if initialString contains spaces
    if(initialString.includes(" ")){
      return initialString.split(" ");
    }
    //handle when only 1 benchmark
    else {
      return [initialString];
    }
  }  else {
    //mainly for selectReportNum === '8'
    return initialString;
  }
};

const formatData = (parsedData, selectedReportNum) => {
  if (!Array.isArray(parsedData)) {
    return [];
  }

  const updatedData= parsedData.map((entry, index) => {
    //prevents updating the objs in parsedData
    const updatedEntry = { ...entry, uniqueId: index }; // Create a new object

    //convert datePulled to date
    if (updatedEntry.datePulled) {
      updatedEntry.datePulled = stringToDate(objectToString(updatedEntry.datePulled));
    }

    //convert modifiedDate to date
    if(updatedEntry.modifiedDate) {
      updatedEntry.modifiedDate = stringToDate(updatedEntry.modifiedDate);
    }
    
    //convert percentage strings to decimals
    ['assessed', 'submitted', 'accepted', 'rejected'].forEach(prop => {
      if (typeof updatedEntry[prop] === 'string') {
        updatedEntry[prop] = formatPercentage(updatedEntry[prop]);
      }
    });

    //convert objects to strings
    ['sysAdmin', 'primOwner', 'deviceType'].forEach(prop => {
      if (updatedEntry[prop]) {
        updatedEntry[prop] = objectToString(updatedEntry[prop]).replace("_$", "");
      }
    });

    //convert to numeric
    const numericProperties = ['cat1', 'cat2', 'cat3'];
    numericProperties.forEach(prop => {
      if (updatedEntry[prop] !== undefined) {
        updatedEntry[prop] = stringToNumeric(objectToString(updatedEntry[prop]));
      }
    });

    //convert emass and code to strings
    ['emass', 'code'].forEach(prop => {
      if (updatedEntry[prop]) {
        updatedEntry[prop] = numToString(updatedEntry[prop]);
      }
    });

    //convert benchmarks to array for report5 and report14
    if (updatedEntry.benchmarks) {
      updatedEntry.benchmarks = convertBenchmarksToArray(updatedEntry.benchmarks, selectedReportNum);
      // console.log("benchmarks: ", updatedEntry.benchmarks);
    }

    // return { ...entry, uniqueId: index }; // Add a unique identifier
    return updatedEntry;
  });
  return updatedData;
};



const DashboardTab = ({reportData, selectedReportNum}) => {
  //converts JSON strings to JS objects/array 
  let parsedData = typeof reportData === 'string' ? JSON.parse(reportData): reportData;

  const formattedData = useMemo(() => formatData(parsedData, selectedReportNum), [parsedData, selectedReportNum]);

  //keeps track of the selectedReport state
  const [setSelectedReport] = useState(null);

  // useEffect(() => {
  //   console.log('Formatted Data:', formattedData);
  // }, [formattedData]);

  const handleClick = useCallback((reportNum) => {
    setSelectedReport(reportNum);
  }, [setSelectedReport]);

  // decide which grid layout to display based on report
  switch (selectedReportNum) {
    case '5':
      return <DashboardSelectedReport5 data={formattedData} title=' Asset Metrics' handleClick={handleClick} />
    case '7':
      return <DashboardSelectedReport7 data={formattedData} title='RMF Package Asset Count' handleClick={handleClick} />
    case '8':
      return <DashboardSelectedReport8 data={formattedData} title='STIG Benchmark Version Deltas' handleClick={handleClick} />
    case '9':
      return <DashboardSelectedReport9 data={formattedData} title='Open Result Finding Metrics' handleClick={handleClick} />
    case '11':
      return <DashboardSelectedReport11 data={formattedData} title='Checks Not Updated in x Days' handleClick={handleClick} />
    case '14':
      return <DashboardSelectedReport14 data={formattedData} title='Historical Data' handleClick={handleClick} />
    case '15':
      return <DashboardSelectedReport15 data={formattedData} title='Unclass Core Printers Metrics' handleClick={handleClick}/>
    default:
      return null
  }    
};

export default DashboardTab;


