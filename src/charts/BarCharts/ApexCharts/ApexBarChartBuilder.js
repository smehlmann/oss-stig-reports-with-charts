import React, { useMemo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { palette } from "../../palette.js";
import numeral from "numeral";

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




// import React, {useMemo, useEffect, useState } from "react";
// import ReactApexChart from "react-apexcharts";
// import { palette } from "../../palette.js";
// // import '../../../Charts.css';
// import numeral from "numeral";

// const ApexBarChartBuilder = ({ dataLabels, dataValues, title, isHorizontal, xAxisHeader, yAxisHeader, onClick }) => {
//   const [series, setSeries] = useState([{ name: xAxisHeader, data: dataValues }]);
  
//   //Format the axes titles
//   const axisTitleStyle = useMemo(() => ({
//     fontSize: '15px',
//     fontFamily: 'Segoe UI',
//     fontWeight: '500',
//     margin: '0',
//   }), []);

//   const [options, setOptions] = useState({
//     chart: {
//       type: 'bar',
//       height: '100%',
//       width: '100%',
//       events: {
//         dataPointSelection: onClick,
//       },
//       toolbar: {
//         show: true,
//         tools: {
//           download: true,
//           selection: true,
//           zoom: true,
//           zoomin: true,
//           zoomout: true,
//           pan: true,
//           reset: true,
//         },
//         autoSelected: 'none',
//       },
//     },
//     colors: palette,
//     dataLabels: {
//       enabled: false,
//     },
    
//     xaxis: {
//       categories: dataLabels,
//       title: {
//         text: xAxisHeader,
//         style: axisTitleStyle
//       },
//     },
//     yaxis: {
//       title: {
//         text: yAxisHeader,
//         style: axisTitleStyle,
//       },
//       labels: {
//         formatter: function (value) {
//           // Check if the value is less than 1 (interpreted as a percentage)
//           if (value <= 1) {
//             return numeral(value * 100).format('0.00') + '%';
//           }
//           // Otherwise, return the value as is
//           return value;
//         }
//       }
//     },
//     title: {
//       text: title,
//       align: 'center',
//       style: {
//         fontSize: '25px',
//         fontFamily: 'Segoe UI',
//         fontWeight: '900',
//       }
//     },
    
//     tooltip: {
//       enabled: true,
//       shared: false,
//       intersect: true,
//       x: {
//         formatter: function (val, opts) {
//           const dataLabelsArray = opts.w.globals.initialConfig.xaxis.categories;
//           const dataLabel = dataLabelsArray[opts.dataPointIndex];
//           console.log("Tooltip Formatter: ", { val, opts, dataLabel, dataLabels: dataLabelsArray }); // Debugging statement
//           return dataLabel !== undefined ? dataLabel : '';
//         },
//       },
//       y: {
//         formatter: function(value) {
//           // Check if the value is less than 1 (interpreted as a percentage)
//           if (value <= 1) {
//             return numeral(value * 100).format('0.00') + '%';
//           }
//           // Otherwise, return the value as is
//           return value;
//         },
//         title: {
//           formatter: () => ""
//         }
//       }
     
//     },
//     plotOptions: {
//       bar: {
//         borderRadius: 4,
//         horizontal: isHorizontal,
//         columnWidth: "35%",
//         endingShape: "rounded",
//       },
//     },
//     legend: {
//       show: false,
//     },
//     responsive: [
//       {
//         breakpoint: 1000,
//         options: {
//           plotOptions: {
//             bar: {
//               height: 400,
//               borderRadius: 4,
//               horizontal: isHorizontal
//             }
//           },
//           legend: {
//             position: "bottom"
//           }
//         }
//       }
//     ]
//   });

//   useEffect(() => {
//     setSeries([{ name: xAxisHeader, data: dataValues }]);
//   }, [dataValues, xAxisHeader]);

//   useEffect(() => {
//     setOptions((prevOptions) => ({
//       ...prevOptions,
//       xaxis: {
//         ...prevOptions.xaxis,
//         categories: dataLabels,
//         title: {
//           text: xAxisHeader,
//           style: axisTitleStyle
//         },
//       },
//       yaxis: {
//         ...prevOptions.yaxis,
//         title: {
//           text: yAxisHeader,
//           style: axisTitleStyle,
//         },
//       },
//     }));
//   }, [dataLabels, xAxisHeader, yAxisHeader, axisTitleStyle]);

//   return (
//     <ReactApexChart options={options} series={series} type="bar" height="100%" width="100%" />
//   );
// };

// export default ApexBarChartBuilder;



/*
import React from "react";
import ReactApexChart from "react-apexcharts";
import { palette } from "../../palette.js";
import "../../../Charts.css"

const ApexBarChartBuilder = ({ dataLabels, dataValues, title, isHorizontal, xAxisHeader, yAxisHeader, onClick }) => {
  const series = [{
    name: xAxisHeader,
    data: dataValues
  }];

  const options = {
    chart: {
      height: '100%',
      width: '100%',
      type: 'bar',
      events: {
        dataPointSelection: onClick,
      },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: false,
        zoomedArea: {
          fill: {
            color: '#fff',
            opacity: 0.4
          },
          stroke: {
            color: '#000',
            opacity: 0.4,
            width: 1
          }
        }
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
        autoSelected: 'zoom'
      }
    },
    colors: palette,
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: dataLabels,
      type: 'category',
      title: {
        text: xAxisHeader,
        style: {
          fontSize: '18px',
          fontFamily: 'Segoe UI',
          fontWeight: 'normal',
        }
      }
    },
    yaxis: {
      title: {
        text: yAxisHeader,
        style: {
          fontSize: '18px',
          fontFamily: 'Segoe UI',
          fontWeight: 'normal',
        }
      }
    },
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '25px',
        fontFamily: 'Segoe UI',
        fontWeight: 'bold',
      }
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      x: {
        formatter: (val, opts) => dataLabels[opts.dataPointIndex]
      },
      y: {
        formatter: (value) => `${value}`,
        title: {
          formatter: () => ""
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: isHorizontal,
      }
    },
    legend: {
      show: false
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          plotOptions: {
            bar: {
              horizontal: isHorizontal
            }
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };

  return (
    <div className="apex-chart" style={{ height: '100%', width: '100%' }}>
      <ReactApexChart options={options} series={series} type="bar" height="100%" width="100%" />
    </div>
  );
};

export default ApexBarChartBuilder;

*/
