import { useEffect, useRef } from "react";
import { palette } from "../palette";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart, Title, Tooltip, ArcElement, Legend } from "chart.js/auto";

Chart.register(Title, Tooltip, ArcElement, Legend, ChartDataLabels);

const BarChartBuilder = ({ dataLabels, dataValues, title, yAxisHeader, xAxisHeader }) => {

  //Creates a ref that will be used to reference the canvas element where chart will be rendered
  const chartRef = useRef(null);

  //Ref will store the reference to current chart instance
  const chartInstanceRef = useRef(null);

  //Create chart
  useEffect(() => {
      //Get canvas context
      const ctx = chartRef.current?.getContext("2d");
      // if (ctx) {
      if (ctx) {
        //Configure chart data
        const chartData = {
          labels: dataLabels,
          datasets: [
            {
              label: title,
              data: dataValues,
              backgroundColor: palette,
              borderWidth: 1,
            },
          ],
        };
    
        //define chartOptions structure 
        const chartOptions = {
          scales: {
            x: {
              type: "category", //for labels
              labels: dataLabels,
              title: {
                display: true,
                text: yAxisHeader,
              },
            },
            y: {
              type: "logarithmic", // for values
              beginAtZero: true,
              values: dataValues,
              title: {
                display: true,
                text: xAxisHeader,
              },
              ticks: {
                padding: 10,
                autoSkip: true,
               
              },
            },
          },

  
          plugins: 
          {
            title: {
              display: true,
              text: title,
              font: {
                family: 'Times',
                size: 20,
                style: 'normal',
                lineHeight: 1.2
              },
            },
            datalabels: {
              color: "white",
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
      <canvas ref={chartRef} id="myChart"  height="200"/>
    </div>
  );
};
export default BarChartBuilder;


// import { useEffect, useRef } from "react";
// import { palette } from "../palette";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import { Chart, Title, Tooltip, ArcElement, Legend } from "chart.js/auto";

// Chart.register(Title, Tooltip, ArcElement, Legend, ChartDataLabels);

// const BarChartBuilder = ({  dataLabels, dataValues, title, yAxisHeader, xAxisHeader }) => {
//   const chartRef = useRef(null);
//   const chartInstanceRef = useRef(null);

//   useEffect(() => {
//     const ctx = chartRef.current?.getContext("2d");

//     if (ctx) {
//       if (!chartInstanceRef.current) {
//         // Create a new chart instance if it doesn't exist
//         chartInstanceRef.current = new Chart(ctx, {
//           type: "bar",
//           data: {
//             labels: dataLabels,
//             datasets: [
//               {
//                 label: "code",
//                 data: dataValues,
//                 backgroundColor: palette,
//                 borderWidth: 1,
//               },
//             ],
//           },
//           options: {
//             scales: {
//               x: {
//                 type: "category",
//                 labels: dataLabels,
//                 title: {
//                   display: true,
//                   text: xAxisHeader,
//                 },
//               },
//               y: {
//                 type: "logarithmic",
//                 beginAtZero: true,
//                 title: {
//                   display: true,
//                   text: yAxisHeader,
//                 }
//               },
//             },
//             plugins: {
//               title: {
//                 display: true,
//                 text: title,
              
//               },
//               datalabels: {
//                 color: "white",
//               },
//             },
//             animation: {
//               duration: 1000, // Animation duration (in milliseconds)
//             },
//           },
//         });
//       } else {
//         // Update the existing chart instance with new data
//         chartInstanceRef.current.data.labels = dataLabels;
//         chartInstanceRef.current.data.datasets[0].data = dataValues;
//         chartInstanceRef.current.options.plugins.title.text = title;
//         chartInstanceRef.current.options.scales.x.title.text = xAxisHeader;
//         chartInstanceRef.current.options.scales.y.title.text = yAxisHeader;
//         chartInstanceRef.current.update();
//       }
//     }

//     // Cleanup function to destroy chart instance on unmount
//     return () => {
//       if (chartInstanceRef.current) {
//         chartInstanceRef.current.destroy();
//         chartInstanceRef.current = null;
//       }
//     };
//   }, [dataLabels, dataValues, title, xAxisHeader, yAxisHeader]);

//   return <canvas ref={chartRef} id="myChart" width="600" height="600" />;
// };

// export default BarChartBuilder;