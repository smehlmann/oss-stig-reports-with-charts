import { useEffect, useState, useMemo } from "react";
// import { Chart } from "chart.js/auto";
// import { palette} from "../../palette.js";
import { fetchData } from "../../DataExtractor.js";
import useLocalStorageListener from "../../../components/useLocalStorageListener.js";
import ValueCountMap from "../../ValueCountMap.js";
// import PieChartBuilder from "./PieChartBuilder.js";
import ApexDonutChartBuilder from "./ApexDonutChartBuilder.js";

//"data" is an array of objects. 

const ApexDonutCountChart = ({ targetColumn, chartTitle, legendName }) => {
  //Initialize variable 'data' and function setData. Initial value of data=empty array
  const [data, setData] = useState([]);

  // flag to indicate that report data has been fetched
  const [dataFetched, setDataFetched] = useState(false);

  // which report was selected by the user
  // const selectedReport = localStorage.getItem("selectedReport");
 // console.log("selectedReport: " + selectedReport);

  useLocalStorageListener((event) => {
    if (event.type === "storage") {
      setDataFetched(true);
    }
  });

  //Retrieve data from report
  useEffect(() => {
    // console.log("BarChartBuilder from useEffect");
    if (localStorage.getItem("ossStigReport")) {
      setDataFetched(true);
      window.addEventListener("storage", storageEventHandler, false);
    }
  }, []);

  function storageEventHandler() {
    // console.log("hi from storageEventHandler");
    if (localStorage.getItem("ossStigReport")) {
      setDataFetched(true);
    }
  }
  useEffect(() => {
    //fetchDataAndBuildChart asynchronously fetches data from the specified csv file
    const fetchDataAndBuildChart = async () => {
      const parsedData = await fetchData();
      if (parsedData) {
        setDataFetched(true);
        setData(parsedData);
      }
    };

    fetchDataAndBuildChart();
  }, [dataFetched]);

  //prints out properties of each item 
  // data.forEach((item, index) => {
  //   console.log(`Keys of item at index ${index}:`, Object.keys(item));
  // });


  //barLabels = value, barValues = number of occurrences of value
  const countMap = useMemo(() => ValueCountMap(data, targetColumn), [data, targetColumn]);
  
  const donutLabels = useMemo(() => Object.keys(countMap), [countMap]);
  const donutValues = useMemo(() => Object.values(countMap), [countMap]);
  
  return (
    <ApexDonutChartBuilder
      dataLabels={donutLabels}
      dataValues={donutValues}
      title={chartTitle}
      lengendTitle={legendName}
    />
  );
};

export default ApexDonutCountChart;

/*
So I have the following functional component that takes in a target column, counts the values present in the target column, and then passes these to another function to build the chart. However, what I want to do is to create a 
*/