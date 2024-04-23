import { useEffect, useState, useRef } from 'react';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { fetchData } from './DataExtractor';
import { palette } from './palette';
import {
  Chart,
  Title,
  Tooltip,
  ArcElement,
  Legend,
} from 'chart.js/auto';

Chart.register(
  Title,
  Tooltip,
  ArcElement,
  Legend, ChartDataLabels
);

const DonutChartBuilder = () => {
  //Initialize variable 'data' and function setData. Initial value of data=empty array
  const [data, setData] = useState({});
  //Acts as reference to the chart canvas. 
  const chartRef = useRef(null);
  //Ref will store the reference to current chart instance
  const chartInstanceRef = useRef(null);
  const [dataFetched, setDataFetched] = useState(false);

  //calculate the avg of column vals
  const calculateAverage = (values) => {
    const sum = values.reduce((total, value) => total + value, 0);
    return values.length > 0 ? sum / values.length : 0;
  };


  //This useEffect runs once component mounts
  useEffect(() => {
    //Uses fetchData to retrieve data from file
    const fetchDataAndBuildChart = async () => {
      const parsedData = await fetchData();
      setDataFetched(true);
    //   console.log("Data in Donut: ", parsedData);
    };
    //function call
    fetchDataAndBuildChart();
  }, [dataFetched]);


  //Create chart
  useEffect(() => {
    //Check for available data
    if (data.length > 0) {
      //Get canvas context
      const ctx = chartRef.current?.getContext('2d');
      if (ctx) {

        //calculate the avgs of assessed, submitted, accepted and rejected
        const assessedValues = data.map(entry => entry.assessed);
        const submittedValues = data.map(entry => entry.submitted);
        const acceptedValues = data.map(entry => entry.accepted);
        const rejectedValues = data.map(entry => entry.rejected);

        const assessedAvg = calculateAverage(assessedValues);
        const submittedAvg = calculateAverage(submittedValues);
        const acceptedAvg = calculateAverage(acceptedValues);
        const rejectedAvg = calculateAverage(rejectedValues);

        const labels = ["Avg of Assessed", "Avg of Submitted", "Avg of Accepted", "Avg of Rejected"];
        const averages = [assessedAvg, submittedAvg, acceptedAvg, rejectedAvg];
        //Configure chart data
        const chartData = {
          labels: labels,
          datasets: [{
            label: 'Average',
            data: averages,
            //backgroundColor: ['#3048ff', '#7a8dfa', '#183090', '#0558a6'],
            backgroundColor: palette, //use palette colors
            borderWidth: 0,
            borderRadius: 3,
          }],
        };

        //   Configure labels in chart
        const chartOptions = {
          responsive: true,
          plugins: {
            datalabels: {
              align: 'top',
              labels: {
                index: {
                  font: {
                    size: 14,
                  },
                  color: '#fff',
                  formatter: (val, ctx) => `${(val * 100).toFixed(2)}%`,
                  // anchor: 'start',
                  // offset: 30, 
                  align: 'bottom',
                },
                // formatter: (value, averages) => `${(value*100).toFixed(2)}%`, 

              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += (context.parsed * 100).toFixed(2) + '%'; // Format value as percentage
                  }
                  return label;
                }
              }
            },

            //format legend
            legend: {
              display: true,
              responsive: true,
              labels: {
                // font: {
                //   size: 14,
                // },
                color: '#fff', // Set the color of legend labels

              },
            },
          },
        };

        //If previous chart exists, destory it
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        //New bar chart instance created with assigned data and options
        const newChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: chartData,
          options: chartOptions,
        });
        console.log("assessed avg: ", assessedAvg);
        console.log("submitted avg: ", submittedAvg);
        console.log("accepted avg: ", acceptedAvg);
        console.log("rejected avg: ", rejectedAvg);
        chartInstanceRef.current = newChartInstance;
      }
    }
  }, [data]);



  return (
    <div className='doughnut-chart-container'>
      {/* Uncomment the next line if you want to visualize the parsed data */}

      {/* Render the Bar chart */}
      <h2>From Power BI</h2>
      <canvas ref={chartRef} />

    </div>
  );
};
export default DonutChartBuilder;









