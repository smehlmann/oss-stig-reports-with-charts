import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { palette } from "../../../theme";

const ApexPieChartBuilder = ({ dataLabels, dataValues, title, legendTitle, onClick }) => {
  const [series, setSeries] = useState(dataValues);

  const [options, setOptions] = useState({
    chart: {
      type: 'pie',
      events: {
        dataPointSelection: onClick,
      },
    },
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true
      },
    },
    labels: dataLabels,
    colors: palette,
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '25px',
        fontFamily: 'Segoe UI'
      },
    },
    legend: {
      position: 'bottom',
      title: {
        text: legendTitle,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '13px',
        fontFamily: 'Segoe UI',
        fontWeight: 'bold',
        colors: ['#283249'], //background color 
      },
      background: {
        enabled: true,
        foreColor: '#ffffff',
        padding: 4,
        borderRadius: 4,
        borderWidth: 0,
        borderColor: '#283249',
        opacity: 0.9,
      },
      //  color: '#50068b',
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.7,
      },
      formatter: function (val, { seriesIndex, w }) {
        const label = w.globals.labels[seriesIndex];
        return label;
      },
    },
    responsive: [{
      breakpoint: 1000,
      options: {
        chart: {
           height: '100%',
           width : '100%',
        },
        legend: {
          position: 'bottom',
        }
      }
    }]
  });

  useEffect(() => {
    setSeries(dataValues);
  }, [dataValues]);

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      labels: dataLabels,
    }));
  }, [dataLabels]);

  return <Chart options={options} series={series} type="pie" style={{ height: '100%', width: '100%' }} />;
};

export default ApexPieChartBuilder;
