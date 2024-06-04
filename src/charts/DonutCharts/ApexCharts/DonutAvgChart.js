import { useEffect, useState, useMemo } from "react";
// import { Chart } from "chart.js/auto";
// import { palette} from "../../palette.js";
import { fetchData } from "../../DataExtractor.js";
import useLocalStorageListener from "../../../components/useLocalStorageListener.js";
import PropertyAvgMap from "../../PropertyAvgMap.js";
import numeral from "numeral";
import ApexDonutChartBuilder from "./ApexDonutChartBuilder.js";

//"data" is an array of objects. 

const DonutAvgChart = ({ targetColumns, chartTitle, legendName }) => {
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
  
  const averageMap = useMemo(() => PropertyAvgMap(data, targetColumns), [data, targetColumns]);
  
  // format avgs as percentages 
  const formattedAverageMap = useMemo(() => {
    const formattedMap = {};
    Object.keys(averageMap).forEach((key) => {
      formattedMap[key] = numeral(averageMap[key] * 100).format('0.00') + '%';
    });
    return formattedMap;
  }, [averageMap]);

  const donutLabels = useMemo(() => Object.keys(averageMap), [averageMap]);
  const donutValues = useMemo(() => Object.values(averageMap), [averageMap]);

  return (
    <ApexDonutChartBuilder
      dataLabels={donutLabels}
      dataValues={donutValues}
      title={chartTitle}
      lengendTitle={legendName}
      
    />
  );
};

export default DonutAvgChart;
