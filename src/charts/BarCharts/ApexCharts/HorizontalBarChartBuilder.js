import React, { useMemo, useEffect, useState, useCallback } from "react";
// import { palette } from "../../palette.js";
import { useTheme } from "../../../theme.js"
import ReactApexChart from "react-apexcharts";
// import Chart  from "react-apexcharts";

const HorizontalBarChartBuilder = ({ dataLabels, dataValues, isHorizontal, xAxisHeader, yAxisHeader, onClick, formatLabelToPercentage }) => {
  const theme = useTheme();

  //default axis title style
  const axisTitleStyle = useMemo(() => ({
    fontSize: '14px',
    fontFamily: 'Segoe UI',
    fontWeight: '500',
    margin: '0',
    textAlign: 'center',
  
  }), []);
  
  //set color of bars based on bar's label
  //useCallback means function only recreated when theme changes
  const getColorForLabel = useCallback(
    (label) => {
      switch (label) {
        case "Assessed":
          return theme.palette.assessed;
        case "Submitted":
          return theme.palette.submitted;
        case "Accepted":
          return theme.palette.accepted;
        case "Rejected":
          return theme.palette.rejected;
        default:
          return theme.palette.primary.main;
      }
    },
    [theme.palette],
  );
  
  //combine data values with their corresponding colors:
  const seriesData = dataValues.map((value, index)=> ({
    x: dataLabels[index],
    y: value
  }));
  
  const [series, setSeries] = useState([{ name: xAxisHeader, data: seriesData }]);
  //map dataLabels to colors
  const barColors = useMemo(() => dataLabels.map(label => getColorForLabel(label)), [dataLabels, getColorForLabel]);

  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      height: '100%',
      width: '100%',
      scrollable: true,
      events: {
        dataPointSelection: (event, chartContext, config) => {
          onClick(event, chartContext, config);
        },
      },
      toolbar: {
        show: true,
        zoom: {
          enabled: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      // tickPlacement: 'on',
      type:'numeric',
      title: {
        text: xAxisHeader,
        style: axisTitleStyle,
      },
      tickAmount: dataValues.length > 4 ? undefined : dataValues.length, // set tickAmount based on data length
      labels: {
        //if values are decimals, format as %
        formatter: function (value) {
          return formatLabelToPercentage ? formatLabelToPercentage.formatter(value) : value;
        },
        trim: false,
        showDuplicates:false,
      }, //labels
    },

    yaxis: {
      type: 'category',
      categories: dataLabels,
      title: {
        text: yAxisHeader,
        style: axisTitleStyle,
      },
      labels: {
        //if values are decimals, format as %
        formatter: function (value) {
          return formatLabelToPercentage ? formatLabelToPercentage.formatter(value) : value;
        },
        trim: false,

      }, //labels
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
        borderRadius: 4,
        horizontal: isHorizontal,
        distributed: true, 
      },
    },
    fill: {
      opacity: 1 
    },

    legend: {
      show: false,
    },
    grid: {
      left: 200,

    },
    
   responsive : [
      {
        breakpoint: 1300,
        options: {
          enableToolbar: true,
          xaxis: {
            labels: {
              style: {
                fontSize: '11px',
              },
            },
            title: {
              style: {
                fontSize: '15px',
              },
            },
          },
          yaxis: {
            labels: {
              formatter: function (value) {
                if (formatLabelToPercentage) {
                  return formatLabelToPercentage.formatter(value);
                }
                return value;
              },
              style: {
                fontSize: '11px',
              },
            },
            title: {
              style: {
                text: yAxisHeader,
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
          enableToolbar: true,
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
                text: yAxisHeader,
                fontSize: '8px',
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

  
  //update series data when dataValues, dataLabels, or getColorForLabel change
  useEffect(() => { 
    const updatedSeriesData = dataValues.map((value, index) => ({
      x: dataLabels[index],
      y: value,
      fillColor: getColorForLabel(dataLabels[index])
    }));
    setSeries([{ name: xAxisHeader, data: updatedSeriesData }]);
  }, [dataValues, dataLabels, getColorForLabel, xAxisHeader]);
  
  //update options when dataLabels, xAxisHeader, yAxisHeader, axisTitleStyle, or barColors change
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
        labels: {
          maxWidth: '40%', //enough to fully display labels
          offsetX: 3,
          
          style: {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            cssClass: 'apexcharts-yaxis-label',
            padding: 15,
            width: '200px',
          },
        }
      },
     colors: barColors,
    }));
    // console.log("Options Updated: ", dataLabels, xAxisHeader, yAxisHeader);
  }, [dataLabels, xAxisHeader, yAxisHeader, axisTitleStyle,barColors]);
  
  return (
    <div className="apex-chart" 
      style={{ height: '100%', width: '100%', 
      paddingRight: '5px', overflowY:'scroll',
      }}
    >
      {/* conditionally set height based on how many datalabels there are */}
      <ReactApexChart options={options} series={series} type="bar" height={dataLabels.length >= 16 ? 'auto' : '100%'}  />
    </div>
  );
  };
  

export default HorizontalBarChartBuilder;




/*
  const theme = useTheme();

  const axisTitleStyle = useMemo(() => ({
    fontSize: '14px',
    fontFamily: 'Segoe UI',
    fontWeight: '500',
    margin: '0',
    textAlign: 'center',
  }), []);

  const getColorForLabel = useCallback(
    (label) => {
      switch (label) {
        case "Assessed":
          return theme.palette.assessed;
        case "Submitted":
          return theme.palette.submitted;
        case "Accepted":
          return theme.palette.accepted;
        case "Rejected":
          return theme.palette.rejected;
        default:
          return theme.palette.primary.main;
      }
    },
    [theme.palette],
  );

  const seriesData = dataValues.map((value, index) => ({
    x: dataLabels[index],
    y: value,
  }));

  const [series, setSeries] = useState([{ name: xAxisHeader, data: seriesData }]);
  const barColors = useMemo(() => dataLabels.map(label => getColorForLabel(label)), [dataLabels, getColorForLabel]);

  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      height: '100%',
      width: '100%',
      events: {
        dataPointSelection: (event, chartContext, config) => {
          onClick(event, chartContext, config);
        },
      },
      toolbar: {
        show: true,
      },
      // scrollable: true,
    },
    dataLabels: {
      enabled: false,
    },
    
    xaxis: {
      type: 'category',
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
          return formatLabelToPercentage ? formatLabelToPercentage.formatter(value) : value;
        },
        maxWidth: '30%', // Adjust the width of the y-axis label to prevent truncation
        style: {
          fontSize: '12px',
          padding: 10, // Add padding to prevent overlap
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: isHorizontal,
        // columnWidth: "20%",
        colors: {
          backgroundBarColors: [],
          opacity: 1,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    responsive: [
      {
        breakpoint: 1300,
        options: {
          xaxis: {
            labels: {
              style: { fontSize: '11px' },
            },
            title: {
              style: { fontSize: '15px' },
            },
          },
          yaxis: {
            labels: {
              style: { fontSize: '11px' },
            },
            title: {
              style: { fontSize: '12px' },
            },
          },
        },
      },
    ],
  });

  useEffect(() => {
    const updatedSeriesData = dataValues.map((value, index) => ({
      x: dataLabels[index],
      y: value,
      fillColor: getColorForLabel(dataLabels[index]),
    }));
    setSeries([{ name: xAxisHeader, data: updatedSeriesData }]);
  }, [dataValues, dataLabels, getColorForLabel, xAxisHeader]);

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
      colors: barColors,
    }));
  }, [dataLabels, xAxisHeader, yAxisHeader, axisTitleStyle, barColors]);

  return (
    <div style={{ height: '100%', width: '100%', overflowY: 'auto' }}>
      <ReactApexChart options={options} series={series} type="bar" height='100%' />
    </div>
  );
};
*/