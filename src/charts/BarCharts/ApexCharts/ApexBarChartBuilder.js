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
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
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
      type: 'category',
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
          // console.log("Tooltip dataLabels: ", dataLabelsArray);
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
        columnWidth: "34%",
        colors: {
          backgroundBarColors: [],
          backgroundBarOpacity: 1,
          opacity: 1, // Ensure bars are 100% opaque
        },
      },
      enableToolbar: true,
    },
    fill: {
      opacity: 1 // Ensure bars are 100% opaque
    },
    legend: {
      show: false,
    },
    responsive: [
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

  // useEffect(() => {
  //   setSeries([{ name: xAxisHeader, data: dataValues, colors: barColors}]);
  // }, [dataValues, xAxisHeader, barColors ]);

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
      },
      colors: barColors,
    }));
    // console.log("Options Updated: ", dataLabels, xAxisHeader, yAxisHeader);
  }, [dataLabels, xAxisHeader, yAxisHeader, axisTitleStyle,barColors]);

  return (
    <div className="apex-chart" style={{ height: '100%', width: '100%', margin: "0" }}>
      <ReactApexChart options={options} series={series} type="bar" height='100%' />
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



