import React, { useMemo, useEffect, useState, useCallback } from "react";

// import { palette } from "../../palette.js";
import { useTheme } from "../../../theme.js"
import ReactApexChart from "react-apexcharts";
// import Chart  from "react-apexcharts";

const HorizontalBarChartBuilder = ({ dataLabels, dataValues, isHorizontal, xAxisHeader, yAxisHeader, onClick, formatLabelToPercentage }) => {
  const theme = useTheme();

  //default axis title style
  const axisTitleStyle = useMemo(() => ({
    fontSize: '16px',
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
      zoom: {
        enabled: true,
      },
      type: 'bar',
      // height: '100%',
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
      // tickPlacement: 'on',
      type:'numeric',
      title: {
        text: xAxisHeader,
        style: axisTitleStyle,
      },
      tickPlacement: 'on',
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
        // style: {
        //   marginBottom: '15',
        // },,
        offsetX: 15, //horizontal positioning of labels 
        offsetY: 20, //vertical positioning of labels
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
        borderRadius: 6,
        horizontal: isHorizontal,
        distributed: true, 
        barHeight: '70%'
      },
    },
    fill: {
      opacity: 1 
    },

    legend: {
      show: false,
    },
    grid: {
      left: 400,
    },
    // responsive: [
    //   {
    //     breakpoint: 1950,
    //     options: {
    //       enableToolbar: true,
    //       xaxis: {
    //         labels: {
    //           style: {
    //             fontSize: '13px',
    //           },
    //         },
    //         title: {
    //           style: {
    //             fontSize: '14px',
    //           },
    //         },
    //       },
    //       yaxis: {
    //         labels: {
    //           style: {
    //             fontSize: '13px',
    //           },
    //         },
    //         title: {
    //           style: {
    //             text: yAxisHeader,
    //             fontSize: '14px',
    //           },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     breakpoint: 1540,
    //     options: {
    //       enableToolbar: true,
    //       xaxis: {
    //         labels: {
    //           style: {
    //             fontSize: '13px',
    //           },
    //         },
    //         title: {
    //           style: {
    //             fontSize: '14px',
    //           },
    //         },
    //       },
    //       yaxis: {
    //         labels: {
    //           style: {
    //             fontSize: '13px',
    //           },
    //         },
    //         title: {
    //           style: {
    //             text: yAxisHeader,
    //             fontSize: '14px',
    //           },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     breakpoint: 600,
    //     options: {
    //       enableToolbar: true,
    //       xaxis: {
    //         labels: {
    //           style: {
    //             fontSize: '8px',
    //           },
    //         },
    //         title: {
    //           style: {
    //             fontSize: '10px',
    //           },
    //         },
    //       },
    //       yaxis: {
    //         labels: {
    //           style: {
    //             fontSize: '8px',
    //           },
    //         },
    //         title: {
    //           style: {
    //             text: yAxisHeader,
    //             fontSize: '10px',
    //           },
    //         },
    //       },
    //     },
    //   },
    // ],
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
      },
     colors: barColors,
    }));
    // console.log("Options Updated: ", dataLabels, xAxisHeader, yAxisHeader);
  }, [dataLabels, xAxisHeader, yAxisHeader, axisTitleStyle,barColors]);
  

  // const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg')); // Check if screen width is 1400px or more
  const chartHeight = Math.max(400, dataLabels.length * 24); //ensures that each row in chart is 24px in height
  // const height = isLargeScreen ? `${chartHeight}px` : '100%'; // Set height based on screen width
  
  // console.log(chartHeight);
  return (
    <div className="apex-chart" 
      style={{ height: '100%', width: '100%', 
      paddingRight: '5px', 
      }}
    >
      {/* conditionally set height based on how many datalabels there are */}
      {/* <ReactApexChart options={options} series={series} type="bar" height={dataLabels.length >= 16 ? 'auto' : '100%'}  /> */}

      <ReactApexChart options={options} series={series} type="bar" height={chartHeight} />

    </div>
  );
  };
  

export default HorizontalBarChartBuilder;



