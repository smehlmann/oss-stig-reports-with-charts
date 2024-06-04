import { useEffect, useState, useRef } from "react";
import { circularChartFill, palette } from "../../palette.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import useLocalStorageListener from "../../../components/useLocalStorageListener.js";
import CreateCustomTooltip from '../../CreateCustomTooltip.js'; 

import { Chart, Title, Tooltip, ArcElement, Legend } from "chart.js/auto";
Chart.register(Title, Tooltip, ArcElement,  ChartDataLabels, Legend);

const PieChartBuilder = ({dataLabels, dataValues, title, legendTitle}) => {

  // Acts as reference to the chart canvas.
  const chartRef = useRef(null);

  //Ref will store the reference to current chart instance
  const chartInstanceRef = useRef(null);

  const [tooltipModel, setTooltipModel] = useState(null);


  useEffect(() => {
    //ctx = rendering context of the chart canvas
    const ctx = chartRef.current?.getContext("2d");
    //if render context is successfully obtained, the chart is ready to be updated
    if (ctx) {
      
      const chartData = {
        labels: dataLabels,
        datasets: [
          {
            label: dataLabels.current,
            data: dataValues,
            backgroundColor: palette,
            borderWidth: 0.5,
            borderRadius: 3,
            hoverBackgroundColor: circularChartFill,
            // hoverBorderColor: "#a8a8f0",
          },
        ],
      };

        //format the labels
      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            align: "center",
            display: true,
            labels: {
              index: {
                font: {
                  size: 12,
                },
                color: "#fff",
                backgroundColor: "rgba(0, 0, 0, 0.8)", // Black background
                borderRadius: 5, // Border radius
                padding: {
                  top: 4,
                  bottom: 4,
                  left: 4,
                  right: 4,
                },
              },
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
          tooltip: {
            enabled: false,
            external: (context) => {
              const tooltip = context.tooltip;
              if (tooltip.opacity === 0) {
                setTooltipModel(null);
                return;
              }
              setTooltipModel(tooltip);
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
    //data = array of objects; each object = row
  }, [dataLabels, dataValues, title, legendTitle]);



  return (
    <div>

      {/* Render the Bar chart */}
      <canvas ref={chartRef} id="simplePieChart" height = "200" />
      <CreateCustomTooltip tooltipModel={tooltipModel} />
    </div>
  );
};

export default PieChartBuilder;
