import { fetchData } from '../DataExtractor';
import React, { useState, useEffect } from "react";
import CreateBasicTable from "./CreateBasicTable";
import numeral from 'numeral';

/* This table will simply be used to display the averages of assessed, submitted, accepted and rejected by each code.*/

/*The reduce() reduces an array to a single value by calling a callback function to be applied to every existing item in an array. Reduce has two parameters: the callback function and the initial value being passed to the function.  For the first argument, the callback function, this accepts currentValue, currentIndex, accumulator, and array, but we are only using the 'accumulator' and 'currentValue'.
However, in the case for this scenario, the second parameter is an empty object {} that will be used to store the data grouped by each unique code value. The 'accumulator' accumulates the result of the operations performed in each iteration—in this case, it's a dictionary (or object in JS) that stores key-value pairs wherein the key is the 'code' and the values is an array of data with the corresponding 'code'. The 'currentValue' is the current element being processed in the iteration.  If the 'code' in a currentValue does not exist as a key in the accumulator dictionary, it is added to the dictionary and given an empty array for its values. Otherwise, if the 'code' in the currentValue exists as a key in the accumulator, then we add that currentValue to the array of values associated with each 'code' key. Once we've iterated through all the entries in csvData, we return the accumulator.
*/


//calculate the avg of column vals
const calculateAverage = (values) => {
  const sum = values.reduce((total, value) => total + value, 0);
  return values.length > 0 ? sum / values.length : 0;
};



function BasicTableExample() {
  //stores average values
  const [averages, setAverages] = useState([]);
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const fetchCsvData = async () => {
      try {

        //extract data from csv using fetchData() 
        csvData = await fetchData();
        setCsvData(csvData);

        //group all the data by its corresponding code
        //accumulator: an object with key-value pairs ->'code' quantity: [data corresponding to specified code quantity]
        const dataGroupedByCode = csvData.reduce((accumulator, currentValue) => {
          //if the currentValue's 'code' entry is not a key in accumulator
          if (!accumulator[currentValue.code]) {
            //add currentValue's 'code' to all keys in accumulator w/ empty array for key's values
            accumulator[currentValue.code] = [];
          }
          //when currentValue's 'code' entry is key in accumulator, add currentValue (or currentItem) to array of values
          accumulator[currentValue.code].push(currentValue);
          //return accumulator when items in csvData have been seen
          return accumulator;
        }, {}); //second argument: initial value which is an empty object (or dictionary)

        // console.log("organized by code: ", dataGroupedByCode);

        // Calculate averages for each code
        const codeAverages = Object.entries(dataGroupedByCode).map(([code, data]) => {
          const assessedValues = data.map(item => item.assessed);
          const submittedValues = data.map(item => item.submitted);
          const acceptedValues = data.map(item => item.accepted);
          const rejectedValues = data.map(item => item.rejected);
          return {
            code,
            avgAssessed: calculateAverage(assessedValues),
            avgSubmitted: calculateAverage(submittedValues),
            avgAccepted: calculateAverage(acceptedValues),
            avgRejected: calculateAverage(rejectedValues),
          };
        });
        setAverages(codeAverages);
        // console.log("Averages: ", codeAverages);

      } catch (error) {
        console.error('Error fetching CSV data:' + error);
      }
    };
    fetchCsvData();
  }, []); // Fetch data on component mount

  const tableColumns = [
    {
      Header: 'Code',
      accessor: 'code',
    },
    {
      Header: 'Avg of Assessed ',
      accessor: 'avgAssessed',
      Cell: ({ value }) => numeral(value * 100).format('0.00') + '%',
    },
    {
      Header: 'Avg of Submitted',
      accessor: 'avgSubmitted',
      Cell: ({ value }) => numeral(value * 100).format('0.00') + '%',
    },
    {
      Header: 'Avg of Accepted ',
      accessor: 'avgAccepted',
      Cell: ({ value }) => numeral(value * 100).format('0.00') + '%',
    },
    {
      Header: 'Avg of Rejected ',
      accessor: 'avgRejected',
      Cell: ({ value }) => numeral(value * 100).format('0.00') + '%',
    },
  ];

  return (
    <div className="table-container">
      <CreateBasicTable data={averages} columns={tableColumns} />
    </div>
  );
}
export default BasicTableExample;

