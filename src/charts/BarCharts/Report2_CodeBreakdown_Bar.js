// eslint-disable-next-line no-unused-vars
import { useEffect, useState, useCallback, useMemo } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart, Title, Tooltip, ArcElement, Legend } from "chart.js/auto";
import { fetchData } from "../DataExtractor.js";
import BarChartBuilder from "./BarChartBuilder.js";
import ValueCountMap from "../ValueCountMap.js";
import useLocalStorageListener from "../../components/useLocalStorageListener.js";
Chart.register(Title, Tooltip, ArcElement, Legend, ChartDataLabels);


/* This is where we specify the data we want for the bar chart. This function looks creates a bar chart that displays the number of occurrences for each value in the specified property (or column in csv). 

Need to rename js file since it no longer is specific to Code breakdown.
*/

const Report2_CodeBreakdown_Bar = ({targetColumn, chartTitle, xAxisTitle, yAxisTitle}) => {
  //Returns the data and function to set the data
  const [data, setData] = useState([]); //data is an array of objects
  const [dataFetched, setDataFetched] = useState(false);
  //const [reportData, setReportDsata] = useState(undefined);

  const selectedReport = localStorage.getItem("selectedReport");
  console.log("selectedReport: " + selectedReport);

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


  //barLabels = value, barValues = number of occurrences of value
  const countMap = useMemo(() => ValueCountMap(data, {targetColumn}), [data, targetColumn]);
  const barLabels = useMemo(() => Object.keys(countMap), [countMap]);
  const barValues = useMemo(() => Object.values(countMap), [countMap]);

  // //define chart title and axes title
  // const chartTitle = "Code Frequency";
  // const xAxisTitle = "Code";
  // const yAxisTitle = "Frequency";

  //pass as props
  return (
    <BarChartBuilder
      dataLabels={barLabels}
      dataValues={barValues}
      title={chartTitle}
      xAxisHeader={xAxisTitle}
      yAxisHeader={yAxisTitle}
    />
  );
};
export default Report2_CodeBreakdown_Bar;

/* -
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
