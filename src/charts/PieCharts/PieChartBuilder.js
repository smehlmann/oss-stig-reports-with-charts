import { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import { palette } from "../palette.js";
import { fetchData } from "../DataExtractor.js";
import useLocalStorageListener from "../../components/useLocalStorageListener.js";

const ChartBuilder = () => {
  //Initialize variable 'data' and function setData. Initial value of data=empty array
  const [data, setData] = useState([]);

  //chartRef can be used to persist values across renders without causing re-renders when the value changes.  Acts as reference to the chart canvas.
  const chartRef = useRef(null);

  //Ref will store the reference to current chart instance
  const chartInstanceRef = useRef(null);

  // flag to indicate that report data has been fetched
  const [dataFetched, setDataFetched] = useState(false);

  // which report was selected by the user
  const selectedReport = localStorage.getItem('selectedReport');
  console.log('selectedReport: ' + selectedReport);

  useLocalStorageListener((event) => {
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

  useEffect(() => {
    //fetchDataAndBuildChart asynchronously fetches data from the specified csv file
    const fetchDataAndBuildChart = async () => {
      const parsedData = await fetchData();
      if (parsedData) {
        setDataFetched(true);
        console.log(parsedData);
        setData(parsedData);
      }
    };

    fetchDataAndBuildChart();
  }, [dataFetched]);

  useEffect(() => {
    if (data.length > 0) {
      //chartRef.current references the chart canvas
      //ctx = rendering context of the chart canvas
      const ctx = chartRef.current?.getContext("2d");
      //if render context is successfully obtained, the chart is ready to be updated
      if (ctx) {
        //coutMap = (code# -> count of code#)
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
              borderWidth: 0.5,
              borderRadius: 3,
              hoverBackgroundColor: [
                "#003e4f",
                "#4c5b5c",
                "#946c2f",
                "#6b0f12",
                "#b25800",
                "#041f2b",
              ],
              hoverBorderColor: "#000",
            },
          ],
        };

        //format the labels
        const chartOptions = {
          responsive: true,
          plugins: {
            datalabels: {
              align: "top",
              display: true,
              labels: {
                index: {
                  font: {
                    size: 12,
                  },
                  color: "#fff",
                  // anchor: 'start',
                  align: "top",
                },
                // formatter: (value, averages) => `${(value*100).toFixed(2)}%`,
              },
            },
            //format legend
            legend: {
              display: true,
              labels: {
                font: {
                  size: 14,
                },
                color: "#000", // Set the color of legend labels
                padding: 5, // Add padding between legend items
                // Set the width of the colored box next to the legend label
              },
            },
          },
        };

        //If previous chart exists, destory it
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
        //New bar chart instance created
        const newChartInstance = new Chart(ctx, {
          type: "pie",
          data: chartData,
          options: chartOptions,
        });

        chartInstanceRef.current = newChartInstance;
      }
    }
    //data = array of objects; each object = row
  }, [data]);

  //countMap = (code# -> count of code#)
  const getCountMap = (data) => {
    return data.reduce((countMap, row) => {
      //Every time code# appears, increment count
      countMap[row.code] = (countMap[row.code] || 0) + 1;
      return countMap;
    }, {});
  };

  return (
    <div>

      {/* Render the Bar chart */}
      <canvas ref={chartRef} />
    </div>
  );
};

export default ChartBuilder;
