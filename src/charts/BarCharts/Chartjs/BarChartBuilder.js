import { useEffect, useRef, useState } from "react";
import { palette, hoverPalette} from "../../palette";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart, Title, Tooltip, ArcElement, Legend } from "chart.js/auto";
import CreateCustomTooltip from '../../CreateCustomTooltip'; 
Chart.register(Title, Tooltip, ArcElement,  ChartDataLabels, Legend);

//Build standard barchart
const BarChartBuilder = ({ dataLabels, dataValues, title, yAxisHeader, xAxisHeader }) => {

  //Creates a ref that will be used to reference the canvas element where chart will be rendered
  const chartRef = useRef(null);

  //Ref will store the reference to current chart instance
  const chartInstanceRef = useRef(null);

  //set tooltip
  const [tooltipModel, setTooltipModel] = useState(null);

  //Create chart
  useEffect(() => {
      //Get canvas context
      const ctx = chartRef.current?.getContext("2d");
      if (ctx) {
        //Configure chart data
        const chartData = {
          labels: dataLabels,
          datasets: [
            {
              label: dataLabels.current,
              data: dataValues,
              backgroundColor: palette[0],
              borderWidth: 3,
              borderRadius: 10,
              hoverBackgroundColor: hoverPalette[0],
              hoverBorderColor: '#c4dfff'
              
            },
          ],
        };
    
        //define chartOptions structure 
        const chartOptions = {
          scales: {
            x: {
              type: "category", //for labels
              // labels: dataLabels,
              title: {
                display: true,
                text: xAxisHeader,
                font: {
                  size: 18,
                  style: 'normal',
                },
              },
            },
            y: {
              type: "logarithmic", // for values
              beginAtZero: true,
              // values: dataValues,
              title: {
                display: true,
                text: yAxisHeader,
                font: {
                  size: 18,
                  style: 'normal',
                },
              },
              ticks: {
                padding: 10,
              },
            },
          },
          plugins: 
          {
            title: {
              display: true,
              text: title,
              font: {
                family: 'Segoe UI',
                size: 30,
                style: 'normal',
                lineHeight: 1.2
              },
            },
            datalabels: {
              color: "white",
            },
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
              callbacks: {
                title: (tooltipItems) => {
                  const title = chartData.labels[tooltipItems[0].dataIndex];
                  return title;
                },
                label: (tooltipItem) => {
                  const value = chartData.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex];
                  return `Value: ${value}`;
                },
                afterLabel: (tooltipItem) => {
                  const dataset = chartData.datasets[tooltipItem.datasetIndex];
                  const total = dataset.data.reduce((acc, val) => acc + val, 0);
                  const percent = Math.round((dataset.data[tooltipItem.dataIndex] / total) * 100);
                  return `(${percent}%)`;
                }
              },
              backgroundColor: '#0066ff',
              titleFontSize: 16,
              titleFontColor: '#0066ff',
              bodyFontColor: '#000',
              bodyFontSize: 14,
              displayColors: false
            },
   
          },

          maintainAspectRatio: false,
          responsive: true,
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
    
  }, [dataLabels, dataValues, title, yAxisHeader, xAxisHeader]);

  return (
    <div>
      <canvas ref={chartRef} id="simpleBarChart"  height="200"/>
      <CreateCustomTooltip tooltipModel={tooltipModel} />
    </div>
  );
};


export default BarChartBuilder;
