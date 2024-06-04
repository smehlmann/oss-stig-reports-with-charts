import React from "react";
import ReactApexChart from "react-apexcharts";
import { palette} from "../../palette.js";
import "../../../Charts.css"


const ApexBarChartBuilder = ({ dataLabels, dataValues, title, xAxisHeader, yAxisHeader }) => {
  const series = [{
    name: xAxisHeader,
    data: dataValues
  }];

  const options = {
    chart: {
      height: '100%',
      width: '100%',
      type: 'bar',
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
        fontSize: '30px',
        fontFamily: 'Segoe UI',
        fontWeight: 'normal',
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
        horizontal: false,
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
              horizontal: false
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
    <div className="apex-chart" >
      <ReactApexChart options={options} series={series} type="bar"  id="ApexBarChart" />
    </div>
  );
};

export default ApexBarChartBuilder;

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


