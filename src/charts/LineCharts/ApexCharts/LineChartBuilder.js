import React, { useMemo, useEffect, useState, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import { useTheme } from "../../../theme.js"


const LineChartBuilder =({ dataLabels, dataValues, xAxisHeader, yAxisHeader, onClick, }) => {

const axisTitleStyle = useMemo(() => ({
    fontSize: '14px',
    fontFamily: 'Segoe UI',
    fontWeight: '500',
    margin: '0',
    textAlign: 'center',
  }), []);

  
  //combine data values with their corresponding colors:
  const seriesData = dataValues.map((value, index)=> ({
    x: dataLabels[index],
    y: value
  }));

  const [series, setSeries] = useState([{ name: xAxisHeader, data: seriesData }]);
  const [options, setOptions] = useState({
    chart: {
      type: 'area',
      height: '100%',
      width: '100%',
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      markers: {
        size: 0,
      },
      // events: {
      //   dataPointSelection: onClick,
      // },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          // console.log("Data Point Selected: ", config);
          // console.log("Selected Data Labels: ", dataLabels);
          onClick(event, chartContext, config);
        },
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      },
    },
    xaxis: {
      // tickPlacement: 'on',
      type: 'datetime',
      categories: dataLabels,
      title: {
        text: xAxisHeader,
        style: axisTitleStyle,
      },
      tickAmount: dataValues.length > 5 ? undefined : dataValues.length, // set tickAmount based on data length
    },
    yaxis: {
      title: {
        text: yAxisHeader,
        style: axisTitleStyle,
      },
      labels: {
        formatter: function (value) {
          return value;
        },
      },
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      x: {
        formatter: function (val, opts) {
          const dataLabelsArray = opts.w.globals.initialConfig.xaxis.categories;
          // console.log("Tooltip dataLabels: ", dataLabelsArray);
          const dataLabel = dataLabelsArray[opts.dataPointIndex];
          return dataLabel !== undefined ? dataLabel : '';
        },
      },
      y: {
        labels: {
          formatter: function (value) {
            return value;
          },
          
        },
        title: {
          formatter: () => ""
        }
      },
    },
    plotOptions: {
      line: {
        borderRadius: 4,
        columnWidth: "34%",
      },
      enableToolbar: true,
    },

    legend: {
      show: false,
    },
    
  });
}
export default LineChartBuilder; 