import React, { useMemo, useEffect, useState, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
// import { palette } from "../../palette.js";
import { useTheme } from "../../../theme.js"


const ApexBarChartBuilder = ({ dataLabels, dataValues, isHorizontal, xAxisHeader, yAxisHeader, onClick, formatLabelToPercentage}) => {
  const theme = useTheme();

  //default axis title style
  const axisTitleStyle = useMemo(() => ({
    fontSize: '14px',
    fontFamily: 'Segoe UI',
    fontWeight: '500',
    marginBottom: '8px',
    // margin: '0',
    textAlign: 'center',
  }), []);
  
  //set color of bars based on bar's label
  //useCallback means function only recreated when theme changes
  const getColorForLabel = useCallback(
    (label) => {
      switch (label) {
        case 'Assessed':
          return theme.palette.assessed;
        case 'Submitted':
          return theme.palette.submitted;
        case 'Accepted':
          return theme.palette.accepted;
        case 'Rejected':
          return theme.palette.rejected;
        default:
          return theme.palette.primary.main;
      }
    },
    [theme.palette]
  );

  // Combine data values with their corresponding labels
  const seriesData = dataValues.map((value, index) => ({
    x: dataLabels[index],
    y: value,
  }));

  const [series, setSeries] = useState([
    { name: xAxisHeader, data: seriesData },
  ]);

  const barColors = useMemo(
    () => dataLabels.map((label) => getColorForLabel(label)),
    [dataLabels, getColorForLabel]
  );

  // Base options with dynamic orientation adjustments
  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      height: '100%',
      width: '100%',
      justifyContent:'center',
      alignItems: 'center',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
        },
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          onClick?.(event, chartContext, config);
        },
      },
    },
    dataLabels: {
      labels: {
        formatter: function (value) {
          if (formatLabelToPercentage) {
            return formatLabelToPercentage.formatter(value);
          }
          return value;
        },
      },
      style: {
        fontFamily: 'Segoe UI',
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
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.7,
      },
    },
    xaxis: {
      type: isHorizontal ? 'numeric' : 'category',
      ...(!isHorizontal && {
        categories: dataLabels, 
      }),
      title: {
        text: xAxisHeader,
        style: axisTitleStyle,
      },
      labels: {
        formatter: function (value) {
          return formatLabelToPercentage ? formatLabelToPercentage.formatter(value) : value;
        },
        style: {
          fontSize: '14px',
          fontFamily: 'Segoe UI, Arial, sans-serif',
          fontWeight: 400,
          cssClass: 'apexcharts-xaxis-label',
        },
      },
      tickAmount: dataValues.length > 4 ? undefined : dataValues.length,
    },
    yaxis: {
      type: isHorizontal ? 'category' : 'numeric',
      ...(isHorizontal && {
        categories: dataLabels, 
      }),
      title: {
        text: yAxisHeader,
        style: axisTitleStyle,
      },
      labels: {
        formatter: function (value) {
          return formatLabelToPercentage
            ? formatLabelToPercentage.formatter(value)
            : value;
        },
        ...(isHorizontal && {
          offsetX: 15, // horizontal positioning of labels
          offsetY: 20, // vertical positioning of labels
        }),
        style: {
          fontFamily: 'Segoe UI, Arial, sans-serif',
          fontWeight: 400,
        },
      },
    },
    
    fill: {
      opacity: 1,
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      x: {
        formatter: function (val, opts) {
          const dataLabelsArray = opts.w.globals.initialConfig.xaxis.categories;
          const dataLabel = dataLabelsArray[opts.dataPointIndex];
          return dataLabel !== undefined ? dataLabel : '';
        },
      },
      y: {
        labels: {
          formatter: function (value) {
            if (formatLabelToPercentage) {
              return formatLabelToPercentage.formatter(value);
            }
            return value;
          },
          
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: isHorizontal,
        columnWidth: '34%',
        colors: {
          backgroundBarOpacity: 1,
          opacity: 1,
        },
      },
    },
    colors: barColors,
    //adjust grid area if horizontal chart
    ...(isHorizontal && {
      grid: {
        left: 400,
      }
    }),
    legend: {
      show: false,
    },

  });

  // Update series and options on prop changes
  useEffect(() => {
    const updatedSeriesData = dataValues.map((value, index) => ({
      x: dataLabels[index],
      y: value,
      fillColor: getColorForLabel(dataLabels[index]),
    }));
    setSeries([{ name: xAxisHeader, data: updatedSeriesData }]);
  }, [dataLabels, dataValues, getColorForLabel, isHorizontal, xAxisHeader, yAxisHeader]);

  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      xaxis: {
        ...prev.xaxis,
        type: isHorizontal ? 'numeric' : 'category',
        ...(!isHorizontal && {
          categories: dataLabels, 
        }),
        title: { text: xAxisHeader, style: axisTitleStyle },
      },
      yaxis: {
        ...prev.yaxis,
        title: {
          text: yAxisHeader, style: axisTitleStyle 
        },
        //if isHorizontal is true
        ...(isHorizontal && {
          labels: {
            maxWidth: '50%', //enough to fully display labels
            offsetX: 3,
            
            style: {
              fontFamily: 'Segoe UI, Arial, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              cssClass: 'apexcharts-yaxis-label',
              paddingBottom: 20,
            },
          }
        })
      },
      colors: barColors,
    }));
  }, [dataLabels, dataValues, axisTitleStyle, barColors, isHorizontal, xAxisHeader, yAxisHeader]);


  const chartHeight = Math.max(400, dataLabels.length * 24); //ensures that each row in chart is 24px in height
  
  return (
    <div className="apex-chart" style={{ height: '100%', width: '100%' }}>
      <ReactApexChart 
        options={options} 
        series={series} 
        type="bar" 
        height={isHorizontal ? chartHeight : "100%"} 
/>
    </div>
  );
};

export default ApexBarChartBuilder;



/*
WOKRING CODE
const ApexBarChartBuilder = ({ dataLabels, dataValues, isHorizontal, xAxisHeader, yAxisHeader, onClick, formatLabelToPercentage}) => {
  const [series, setSeries] = useState([{ name: xAxisHeader, data: dataValues }]);

  // Default axis title style
  const axisTitleStyle = useMemo(() => ({
    fontSize: '15px',
    fontFamily: 'Segoe UI',
    fontWeight: '500',
    margin: '0',
  }), []);

  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      height: '100%',
      width: '100%',
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
        autoSelected: 'none',
      },
    },
    colors: palette,
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: dataLabels,
      title: {
        text: xAxisHeader,
        style: axisTitleStyle,
      },

    },
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

    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      x: {
        formatter: function (val, opts) {
          const dataLabelsArray = opts.w.globals.initialConfig.xaxis.categories;
          const dataLabel = dataLabelsArray[opts.dataPointIndex];
          return dataLabel !== undefined ? dataLabel : '';
        },
      },
      y: {
        labels: {
          formatter: function (value) {
            if (formatLabelToPercentage) {
              return formatLabelToPercentage.formatter(value);
            }
            return value;
          },
        },
        title: {
          formatter: () => ""
        }
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: isHorizontal,
        columnWidth: "35%",
        endingShape: "rounded",
      },
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          xaxis: {
            labels: {
              style: {
                fontSize: '10px',
              },
            },
            title: {
              style: {
                fontSize: '12px',
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '10px',
              },
            },
            title: {
              style: {
                fontSize: '12px',
              },
            },
          },
          title: {
            style: {
              fontSize: '20px',
            },
          },
        },
      },
      {
        breakpoint: 600,
        options: {
          xaxis: {
            labels: {
              style: {
                fontSize: '8px',
              },
            },
            title: {
              style: {
                fontSize: '10px',
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '8px',
              },
            },
            title: {
              style: {
                fontSize: '10px',
              },
            },
          },
          title: {
            style: {
              fontSize: '15px',
            },
          },
        },
      },
    ],
  });

  useEffect(() => {
    setSeries([{ name: xAxisHeader, data: dataValues }]);
  }, [dataValues, xAxisHeader]);

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: dataLabels,
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
    }));
  }, [dataLabels, xAxisHeader, yAxisHeader, axisTitleStyle]);

  return (
    <div className = "apex-chart" style={{ height: '100%', width: '100%' }}>
      <ReactApexChart options={options} series={series} type="bar"  margin="0" />
    </div>
  );
};

export default ApexBarChartBuilder;
*/



