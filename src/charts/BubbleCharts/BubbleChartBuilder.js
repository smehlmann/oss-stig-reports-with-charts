import React, {useMemo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { palette, useTheme } from "../../theme.js";
// import '../../../Charts.css';


const BubbleChartBuilder = ({ dataLabels, dataValues, xAxisHeader, yAxisHeader, onClick }) => {
  const [series, setSeries] = useState([{ name: xAxisHeader, data: [] }]);

  const theme = useTheme();

  const axisTitleStyle = useMemo(() => ({
    fontSize: '15px',
    fontFamily: 'Segoe UI',
    fontWeight: '500',
    textAlign: 'center',

    // fontFamily: theme.typography.fontFamily,
    // fontSize: theme.typography.h6.fontSize,
    // fontWeight: theme.typography.h6.fontWeight,
  }), [theme]);

  const [options, setOptions] = useState({
    chart: {
      type: 'bubble',
      height: '100%',
      width:  '100%',
      events: {
        dataPointSelection: onClick,
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
          reset: true,
        },
        // autoSelected: 'zoom',
      },
    },
    colors: palette,
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: 'category',
      title: {
        text: xAxisHeader,
        style: axisTitleStyle
      },
      categories: dataLabels,
      
    },
    yaxis: {
      title: {
        text: yAxisHeader,
        style: axisTitleStyle,
      },
    },
    
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
    },
    plotOptions: {
      bubble: {
        minBubbleRadius: 10,
        maxBubbleRadius: 40,
      },
    },
    legend: {
      show: false,
    },
  });

  useEffect(() => {
    setSeries([{ name: xAxisHeader, data: dataValues.map((value, index) => ({ x: dataLabels[index], y: value, z: value })) }]);
  }, [dataLabels, dataValues, xAxisHeader]);

  return (
    <div className = "apex-chart" style={{ height: '100%', width: '100%' }}>
      <ReactApexChart options={options} series={series} type="bubble"  />
    </div>
  );
};

export default BubbleChartBuilder;

