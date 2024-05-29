import { useEffect, useState, useRef } from "react";
import { palette } from "../palette";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart, Title, Tooltip, ArcElement, Legend } from "chart.js/auto";
import { fetchData } from "../DataExtractor.js";
import useLocalStorageListener from "../../components/useLocalStorageListener.js";

Chart.register(Title, Tooltip, ArcElement, Legend, ChartDataLabels);

const BarChartBuilder = (dataLabels, dataValues) => {


  //Creates a ref that will be used to reference the canvas element where chart will be rendered
  const chartRef = useRef(null);

  //Ref will store the reference to current chart instance
  const chartInstanceRef = useRef(null);

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

  //Render chart when 'data' state changes

  //Create chart
  useEffect(() => {
    //Check for available data
    if (data.length > 0) {
      //Get canvas context
      const ctx = chartRef.current?.getContext("2d");
      if (ctx) {
        //coutMap = (codeNum: count of code)
        const countMap = getCountMap(data);

        //labels = code#, values = count per code
        const columnLabels = Object.keys(countMap);
        const columnValues = Object.values(countMap);

        //Configure chart data
        const chartData = {
          labels: columnLabels,
          datasets: [
            {
              label: "code",
              data: columnValues,
              backgroundColor: palette,
              // backgroundColor: 'rgba(75, 192, 192, 0.2)',
              // borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        };
        console.log(columnValues);

        const chartOptions = {
          scales: {
            x: {
              type: "category", // Use 'category' scale for labels
              labels: columnLabels,
            },
            y: {
              type: "logarithmic", // Use 'linear' scale for values
              beginAtZero: true,
              values: columnValues,
            },
          },
          plugins: {
            datalabels: {
              color: "white", // Set data label color to white
            },
          },
        };

        //If previous chart exists, destory it
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
        //New bar chart instance created
        const newChartInstance = new Chart(ctx, {
          type: "bar",
          data: chartData,
          options: chartOptions,
        });

        chartInstanceRef.current = newChartInstance;
      }
    }
  }, [data]);

  //coutMap = (code# -> count of code#)
  const getCountMap = (data) => {
    return data.reduce((countMap, row) => {
      //Every time code# appears, increment count
      countMap[row.code] = (countMap[row.code] || 0) + 1;
      return countMap;
    }, {});
  };

  return (
    <div>
      <canvas ref={chartRef} id="myChart" width="600" height="600" />
    </div>
  );
};
export default BarChartBuilder;
