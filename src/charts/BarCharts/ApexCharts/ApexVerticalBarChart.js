// VerticalBarChart.js
import React, { useEffect, useState, useMemo } from "react";
import ApexBarChartBuilder from "./ApexBarChartBuilder.js";
import { fetchData } from "../../DataExtractor.js";
import ValueCountMap from "../../ValueCountMap.js";
import useLocalStorageListener from "../../../components/useLocalStorageListener.js";

const ApexVerticalBarChart = ({ targetColumn, chartTitle, xAxisTitle, yAxisTitle }) => {
  const [data, setData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  const selectedReport = localStorage.getItem("selectedReport");

  useLocalStorageListener((event) => {
    if (event.type === "storage") {
      setDataFetched(true);
    }
  });

  useEffect(() => {
    if (localStorage.getItem("ossStigReport")) {
      setDataFetched(true);
      window.addEventListener("storage", storageEventHandler, false);
    }
  }, []);

  function storageEventHandler() {
    if (localStorage.getItem("ossStigReport")) {
      setDataFetched(true);
    }
  }

  useEffect(() => {
    const fetchDataAndBuildChart = async () => {
      const parsedData = await fetchData();
      if (parsedData) {
        setDataFetched(true);
        setData(parsedData);
      }
    };
    fetchDataAndBuildChart();
  }, [dataFetched]);

  const countMap = useMemo(() => ValueCountMap(data, targetColumn), [data, targetColumn]);
  const barLabels = useMemo(() => Object.keys(countMap), [countMap]);
  const barValues = useMemo(() => Object.values(countMap), [countMap]);

  return (
    <ApexBarChartBuilder
      dataLabels={barLabels}
      dataValues={barValues}
      title={chartTitle}
      xAxisHeader={xAxisTitle}
      yAxisHeader={yAxisTitle}
    />
  );
};

export default ApexVerticalBarChart;
