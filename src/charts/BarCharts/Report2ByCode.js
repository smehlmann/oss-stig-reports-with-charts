import { useEffect, useState, useCallback } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart, Title, Tooltip, ArcElement, Legend } from "chart.js/auto";
import { fetchData } from "../DataExtractor.js";
import BarChartBuilder from "./BarChartBuilder";
import useLocalStorageListener from "../../components/useLocalStorageListener.js";
Chart.register(Title, Tooltip, ArcElement, Legend, ChartDataLabels);

/* 
DISCUSS: I've noticed that there are a lot of re-renders. Unfortunately, this causes the bars to keep rising repeatedly as it keeps re-rendering. Maybe make adjustments to adjustments for the following code:

  const selectedReport = localStorage.getItem('selectedReport');
  console.log('selectedReport: ' + selectedReport);

  useLocalStorageListener((event) => {
    console.log('hi from useLocalStorageListener')
    if (event.type === "storage") {
      setDataFetched(true);
    }
  });

  useEffect(() => {
    console.log("BarChartBuilder from useEffect");
    if (localStorage.getItem("ossStigReport")) {
      setDataFetched(true);
      window.addEventListener("storage", storageEventHandler, false);
    }
  }, []);

  function storageEventHandler() {
    console.log("hi from storageEventHandler");
    if (localStorage.getItem("ossStigReport")) {
      setDataFetched(true);
    }
  }
*/


//Specify the data you want to display in the bar chart
const Report2ByCode = () => {
  //Returns the data and function to set the data
  const [data, setData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  //const [reportData, setReportDsata] = useState(undefined);

  const selectedReport = localStorage.getItem('selectedReport');
  console.log('selectedReport: ' + selectedReport);

  useLocalStorageListener((event) => {
    // console.log('hi from useLocalStorageListener')
    if (event.type === "storage") {
      setDataFetched(true);
    }
  });

  useEffect(() => {
    // console.log("BarChartBuilder from useEffect");
    if (localStorage.getItem("ossStigReport")) {
      setDataFetched(true);
      window.addEventListener("storage", storageEventHandler, false);
    }
    /* ADDED THIS */
    return () => {
      window.removeEventListener("storage", storageEventHandler);
    };
  }, []);

  function storageEventHandler() {
    if (localStorage.getItem("ossStigReport")) {
      setDataFetched(true);
    }
  }

  //This useEffect runs once component mounts
  useEffect(() => {
    //Uses fetchData to retrieve data from file
    const fetchDataAndBuildChart = async () => {
      const parsedData = await fetchData();
      if (parsedData) {
        setDataFetched(true);
        //console.log(parsedData);
        setData(parsedData);
      }
    };
    //function call
    fetchDataAndBuildChart();
  }, [dataFetched]);

  //coutMap = (code# -> count of code#)
  const getCountMap = (data) => {
    return data.reduce((countMap, row) => {
      //Every time code# appears, increment count
      countMap[row.code] = (countMap[row.code] || 0) + 1;
      return countMap;
    }, {});
  };
  
  //barLabels = code#, barValues = number of times a code is counted
  const countMap = getCountMap(data);
  const barLabels = Object.keys(countMap);
  const barValues = Object.values(countMap);

  //define chart title and axes title
  const chartTitle = "Code Frequency"
  const xAxisTitle = "Code"
  const yAxisTitle = "Frequency"


  //pass as props
  return <BarChartBuilder 
    dataLabels={barLabels} 
    dataValues={barValues}
    title ={chartTitle}
    xAxisHeader = {xAxisTitle}
    yAxisHeader={yAxisTitle}
  />;
};
export default Report2ByCode;
