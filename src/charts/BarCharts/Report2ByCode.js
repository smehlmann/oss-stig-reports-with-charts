import { useEffect, useState, useRef } from "react";
import { palette } from "../palette.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart, Title, Tooltip, ArcElement, Legend } from "chart.js/auto";
import { fetchData } from "../DataExtractor.js";
import BarChartBuilder from "./BarChartBuilder";
import useLocalStorageListener from "../../components/useLocalStorageListener.js";

Chart.register(Title, Tooltip, ArcElement, Legend, ChartDataLabels);


const Report2ByCode = () => {
  //Returns the data and function to set the data
  const [data, setData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  //const [reportData, setReportDsata] = useState(undefined);

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


  //Define to be displayed by chart 

  //coutMap = (code# -> count of code#)
  const getCountMap = (data) => {
    return data.reduce((countMap, row) => {
      //Every time code# appears, increment count
      countMap[row.code] = (countMap[row.code] || 0) + 1;
      return countMap;
    }, {});
  };
  

  //labels = code#, values = count per code
  const countMap = getCountMap(data);
  const columnLab = Object.keys(countMap);
  const dataValues = Object.values(countMap);

  return <BarChartBuilder dataLabels={dataLabels} dataValues={dataValues} />;


};
export default Report2ByCode;
