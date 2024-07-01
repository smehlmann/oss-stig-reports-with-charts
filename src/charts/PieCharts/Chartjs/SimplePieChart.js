import { useEffect, useState, useMemo } from "react";
import { fetchData } from "../../DataExtractor.js";
import useLocalStorageListener from "../../../components/useLocalStorageListener.js";
import ValueCountMap from "../../ValueCountMap.js";
import PieChartBuilder from "./PieChartBuilder.js";
// import ApexPieChartBuilder from "../ApexSamples/ApexPieChartBuilder.js";

/**
See this https://codesandbox.io/p/sandbox/9jk6742xko?file=%2Fsrc%2Fcomponents%2FChart.js%3A52%2C38
 */

export const palette = [
  '#0000F0',
  '#183090',
  '#4860FF',
  '#A8A8F0',
  '#6078FF',
  '#3048FF',
  '#6078D8',
  '#7890FF',
  '#4860D9',
  '#6060A8',
];

export const hoverPalette = [
  "#112959",
  "#153f67",
  "#1a5674",
  "#207480",
  "#28837b",
  "#318e77",
  "#3a9871",
  "#4c9e7b",
  "#5fa180",
  "#6fa18c",
];



const SimplePieChart = ({ targetColumn, chartTitle, legendName }) => {
  //Initialize variable 'data' and function setData. Initial value of data=empty array
  const [data, setData] = useState([]);

  // flag to indicate that report data has been fetched
  const [dataFetched, setDataFetched] = useState(false);

  // which report was selected by the user
  const selectedReport = localStorage.getItem("selectedReport");
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
      // console.log("Parsed: ", parsedData);
        setData(parsedData);
      }
    };

    fetchDataAndBuildChart();
  }, [dataFetched]);

  console.log("Parsed: ", data);
  const countMap = useMemo(() => ValueCountMap(data, targetColumn), [data, targetColumn]);
  
  const pieLabels = useMemo(() => Object.keys(countMap), [countMap]);
  const pieValues = useMemo(() => Object.values(countMap), [countMap]);

  return (
    <PieChartBuilder
      dataLabels={pieLabels}
      dataValues={pieValues}
      title={chartTitle}
      lengendTitle={legendName}
    />
  );
};

export default SimplePieChart;
