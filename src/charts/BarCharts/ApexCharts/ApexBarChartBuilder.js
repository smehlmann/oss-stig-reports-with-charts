import React, {useMemo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { palette } from "../../palette.js";
import '../../../Charts.css';

const ApexBarChartBuilder = ({ dataLabels, dataValues, title, isHorizontal, xAxisHeader, yAxisHeader, onClick }) => {
  const [series, setSeries] = useState([{ name: xAxisHeader, data: dataValues }]);
  
  //Format the axes titles
  const axisTitleStyle = useMemo(() => ({
    fontSize: '15px',
    fontFamily: 'Segoe UI',
    fontWeight: '500',
  }), []);

  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      height: '100%',
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
        autoSelected: 'zoom',
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
        style: axisTitleStyle
      },
    },
    yaxis: {
      title: {
        text: yAxisHeader,
        style: axisTitleStyle,
      },
    },
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '25px',
        fontFamily: 'Segoe UI',
        fontWeight: '900',
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
      },
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: isHorizontal
            }
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
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
          style: axisTitleStyle
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
    <ReactApexChart options={options} series={series} type="bar" height="100%" />
  );
};

export default ApexBarChartBuilder;


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


/*
TRYING TO GET FILTERING LOGIC 
const ApexBarChartBuilder = ({ dataLabels, dataValues, title, isHorizontal, xAxisHeader, yAxisHeader, rawData }) => {
  const { updateFilter } = useFilter();

  const handleBarClick = (event, chartContext, config) => {
    const selectedValue = config.w.config.labels[config.dataPointIndex];
    updateFilter({ department: selectedValue }); // Adjust key according to the actual data structure
  };

  const [series, setSeries] = useState([{ name: xAxisHeader, data: dataValues }]);
  const [options, setOptions] = useState({
    chart: {
      height: '100%',
      width: '100%',
      type: 'bar',
      events: {
        dataPointSelection: handleBarClick,
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
  });

  useEffect(() => {
    setSeries([{ name: xAxisHeader, data: dataValues }]);
  }, [dataValues, xAxisHeader]);

  return (
    <div className="apex-chart" style={{ height: '100%', width: '100%' }}>
      <ReactApexChart options={options} series={series} type="bar" height="100%" width="100%" />
    </div>
  );
};

export default ApexBarChartBuilder;
*/

// const ApexBarChartBuilder = ({ dataLabels, dataValues, title, xAxisHeader, yAxisHeader }) => {
//   //set options => state variable to store configurations
//   const [options, setOptions] = useState({
//     chart: {
//       type: 'bar',
//       //configures zoom options
//       zoom: {
//         enabled: true,
//         type: 'x', // zoom along x-axis
//         autoScaleYaxis: false,
//         zoomedArea: {
//           fill: {
//             color: '#fff',
//             opacity: 0.4
//           },
//           //configures stroke
//           stroke: {
//             color: '#000',
//             opacity: 0.4,
//             width: 1
//           }
//         }
//       },
//       //configure toolbar
//       toolbar: {
//         show: true,
//         tools: {
//           download: true,
//           selection: true,
//           zoom: true,
//           zoomin: true,
//           zoomout: true,
//           pan: true,
//           reset: true
//         },
//         autoSelected: 'zoom',
//       }
//     },
//     colors: palette,    
//     dataLabels: {
//       enabled: false
//     },

//     xaxis: {
//       categories: dataLabels, //categorize x-axis
//       values: dataLabels,
//       type: "category",
//       // tickAmount: 6,
//       title: {
//         text: xAxisHeader,
//         style: {
//           fontSize: '18px',
//           fontFamily: 'Segoe UI',
//           fontWeight: 'normal',
//         }
//       }
//     },
//     yaxis: {
//       title: {
//         text: yAxisHeader,
//         style: {
//           fontSize: '18px',
//           fontFamily: 'Segoe UI',
//           fontWeight: 'normal',
//         }
//       }
//     },
//     title: {
//       text: title,
//       style: {
//         fontSize: '30px',
//         fontFamily: 'Segoe UI',
//         fontWeight: 'normal',
//       }
//     },
//     //enable tooltip
//     tooltip: {
//       enabled: true,
//       shared: true,
//       intersect: false,
//       x: {
//         style:{
//           fontWeight: 'bold',
//         }
//       },
//       y: {
//         formatter: (value) => `${value}`,
//         title: {
//           formatter: () => ""
//         }
//       }
//     },
//     // fill: {
//     //   type: "gradient",
//     //   gradient: {
//     //     shadeIntensity: 1,
//     //     opacityFrom: 0.7,
//     //     opacityTo: 0.5,
//     //     stops: [0, 100]
//     //   }
//     // },
 
//     plotOptions: {
//       bar: {
//         borderRadius: 4,
//         horizontal: false,
//       }
//     },
//     legend: {
//       show: false
//     },
//     theme: {
//       mode: 'light',
//       palette: 'palette1',
//     },
//   });


//   const [series, setSeries] = useState([{
//     name: xAxisHeader,
//     data: dataValues
//   }]);

//   useEffect(() => {
//     setOptions((prevOptions) => ({
//       ...prevOptions,
//       xaxis: {
//         ...prevOptions.xaxis,
//         categories: dataLabels,
//       }
//     }));
//     setSeries([{
//       name: xAxisHeader,
//       data: dataValues
//     }]);
//   }, [dataLabels, dataValues, xAxisHeader, yAxisHeader]);

//   return (
//     <div className="chart">
//       <ReactApexChart options={options} series={series} type="bar" height="350" />
//     </div>
//   );
// };

// export default ApexBarChartBuilder;


