import React, { useMemo, useEffect, useState, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import { useTheme, palette} from "../../../theme.js"
import {useLineChartStyles} from "./useLineChartStyles.js"

// const MultiLineChartBuilder =({ xValues, yValues, xAxisHeader, yAxisHeader, formatLabelToPercentage }) => {

  const MultiLineChartBuilder =({ xValues, yValues, xAxisHeader, yAxisHeader }) => {
const theme = useTheme();
  //styles from custom hook
  const {
    axisTitleStyle, 
    dataLabelPercentageFormatter,  
    dataLabelsOnBarText, 
    dataLabelsOnBarBackground, 
    dataLabelsOnBarDropShadow,
    getColorForLabel,
    axisLabelsStyles,
    tooltipXFormatter,
    tooltipYFormatter, 
    tooltipYTitleFormatter,
    legend,

  } = useLineChartStyles(true, ''); 

  
  const lineColors = useMemo(() => yValues.map(label => getColorForLabel(label.name)), [yValues, getColorForLabel]);

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

      toolbar: {
        autoSelected: 'zoom'
      }
    },
    color: lineColors,
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      },
    },
    series: yValues,
    xaxis: {
      tickPlacement: 'on',
      type: 'datetime',
      categories: xValues,
      title: {
        text: xAxisHeader,
        style: axisTitleStyle,
      },
      tickAmount: yValues.length > 5 ? undefined : yValues.length, // set tickAmount based on data length
      labels: {
        style: axisLabelsStyles,
      }
    },
    colors: palette,
    yaxis: {
      title: {
        text: yAxisHeader,
        style: axisTitleStyle,
      },
      labels: {
        formatter: (value) => dataLabelPercentageFormatter(value),
        style: axisLabelsStyles,
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
      x: {
        formatter: tooltipXFormatter,
      },
      y: {
        formatter: tooltipYFormatter,
        title: {
          formatter: (val) => tooltipYTitleFormatter(val),
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
      show: true,
      ...legend,
    },
    
  });

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: xValues,
        title: {
          text: xAxisHeader,
          style: axisTitleStyle,
        },
      },
      yaxis: {
        ...prevOptions.yaxis,
        title: {
          text: yAxisHeader,
          style: axisTitleStyle,
        },
      },
      colors: lineColors,
    }));
  }, [xValues, xAxisHeader, yAxisHeader, axisTitleStyle, lineColors]);

  return (
    <div className="apex-chart" style={{ height: '100%', width: '100%', margin: "0" }}>
      <ReactApexChart options={options} series={yValues} type="area" height='100%' />
    </div>
  );
}
export default MultiLineChartBuilder; 