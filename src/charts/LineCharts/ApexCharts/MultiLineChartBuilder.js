import React, { useMemo, useEffect, useState, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import { useTheme, palette} from "../../../theme.js"


const MultiLineChartBuilder =({ xValues, yValues, xAxisHeader, yAxisHeader, formatLabelToPercentage }) => {
  // console.log('xValues (dates): ', xValues);
  // xValues.forEach(item => {
  //   console.log("type: ", item instanceof Date);
  // })
  
const theme = useTheme();
const axisTitleStyle = useMemo(() => ({
    fontSize: '14px',
    fontFamily: 'Segoe UI',
    fontWeight: '500',
    margin: '0',
    textAlign: 'center',
  }), []);


  //set color of lines
  //useCallback means function only recreated when theme changes
  const getColorForLabel = useCallback(
    (label) => {
      switch (label) {
        case "Avg Assessed":
          return theme.palette.assessed;
        case "Avg Submitted":
          return theme.palette.submitted;
        case "Avg Accepted":
          return theme.palette.accepted;
        case "Avg Rejected":
          return theme.palette.rejected;
        default:
          return theme.palette.primary.main;
      }
    },
    [theme.palette],
  );

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
        opacityFrom: 0.5,
        opacityTo: 0,
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
    },
    colors: palette,
    yaxis: {
      title: {
        text: yAxisHeader,
        style: axisTitleStyle,
      },
      labels: {
        formatter: function (value) {
          if (formatLabelToPercentage) {
            return formatLabelToPercentage.formatter(value);
          }
          return value;
        },
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
      position: 'bottom',
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