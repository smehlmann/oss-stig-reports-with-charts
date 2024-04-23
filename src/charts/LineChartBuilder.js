import { useEffect, useState, useRef } from 'react';
import { fetchData } from './DataExtractor';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js/auto';


Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const LineChartBuilder = () => {
  //Initialize variable 'data' and function setData. Initial value of data=empty array
  const [data, setData] = useState({});
  //Acts as reference to the chart canvas. 
  const chartRef = useRef(null);
  //Ref will store the reference to current chart instance
  const chartInstanceRef = useRef(null);
  const [dataFetched, setDataFetched] = useState(false);

  //This useEffect runs once component mounts
  useEffect(() => {

    //Uses fetchData to retrieve data from file
    const fetchDataAndBuildChart = async () => {

      const parsedData = await fetchData();
      setData(parsedData);
      setDataFetched(true);
      console.log("Data in ChartBuilder: ", parsedData);
    };
    //function call
    fetchDataAndBuildChart();
  }, [dataFetched]);


  //calculate the avg of column vals
  const calculateAverage = (values) => {
    const sum = values.reduce((total, value) => total + value, 0);
    return values.length > 0 ? sum / values.length : 0;
  };

  //Create chart
  useEffect(() => {
    //Check for available data
    if (data.length > 0) {
      //Get canvas context
      const ctx = chartRef.current?.getContext('2d');
      if (ctx) {

        //extract labels for chart
        //const labels = data.map(entry => entry.dataPulled);
        const labels = data.map(entry => entry.datePulled);
        const assessedValues = data.map(entry => entry.assessed);
        const submittedValues = data.map(entry => entry.submitted);
        const acceptedValues = data.map(entry => entry.accepted);
        const rejectedValues = data.map(entry => entry.rejected);


        const assessedAvg = calculateAverage(assessedValues);
        const submittedAvg = calculateAverage(submittedValues);
        const acceptedAvg = calculateAverage(acceptedValues);
        const rejectedAvg = calculateAverage(rejectedValues);

        //Configure chart data
        const chartData = {
          labels: labels,
          datasets: [
            {
              label: 'Assessed',
              data: assessedAvg,
              borderColor: 'red',
              backgroundColor: 'red',
              borderWidth: 1,
            },
            {
              label: 'Submitted',
              data: submittedAvg,
              borderColor: 'blue',
              backgroundColor: 'blue',
              borderWidth: 1,
            },
            {
              label: 'Accepted',
              data: acceptedAvg,
              borderColor: 'green',
              backgroundColor: 'green',
              borderWidth: 1,
            },
            {
              label: 'Rejected',
              data: rejectedAvg,
              borderColor: 'orange',
              backgroundColor: 'orange',
              borderWidth: 1,
            },
          ],
        };

        const chartOptions = {
          scales: {
            x: {
              type: 'time', // Use 'category' scale for labels
              time: {
                displayFormats: { day: 'MM/DD/YYYY' }
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
          type: 'line',
          data: chartData,
          options: chartOptions,
        });

        chartInstanceRef.current = newChartInstance;
      }
    }
  }, [data]);

  return (
    <div>
      {/* Uncomment the next line if you want to visualize the parsed data */}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

      {/* Render the Bar chart */}
      <h2>From Power BI</h2>
      <canvas ref={chartRef} />

    </div>
  );

};

export default LineChartBuilder;









