import React, { useMemo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTheme, palette} from "../../../theme.js"


const MultiLineChartBuilder =({ xValues, yValues, xAxisHeader, yAxisHeader, onClick, formatLabelToPercentage }) => {
  // console.log('xValues (dates): ', xValues);
  // xValues.forEach(item => {
  //   console.log("type: ", item instanceof Date);
  // })
  
const axisTitleStyle = useMemo(() => ({
    fontSize: '14px',
    fontFamily: 'Segoe UI',
    fontWeight: '500',
    margin: '0',
    textAlign: 'center',
  }), []);

  
  const [options, setOptions] = useState({
    chart: {
      type: 'area',
      height: '100%',
      width: '100%',
      zoom: {
        type: 'x',
        enabled: false,
        autoScaleYaxis: true
      },
      markers: {
        size: 0,
      },
      events: {
        dataPointSelection: onClick,
      },
      // events: {
      //   dataPointSelection: (event, chartContext, config) => {
      //     console.log("Data Point Selected: ", config);
      //     // console.log("Selected Data Labels: ", dataLabels);
      //     onClick(event, chartContext, config);
      //   },
      // },
      // toolbar: {
      //   autoSelected: 'zoom'
      // }
    },
    color: palette,
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
    // tooltip: {
    //   enabled: true,
    //   shared: false,
    //   intersect: true,
    //   x: {
    //     formatter: function (val, opts) {
    //       const dataLabelsArray = opts.w.globals.initialConfig.xaxis.categories;
    //       // console.log("Tooltip dataLabels: ", dataLabelsArray);
    //       const dataLabel = dataLabelsArray[opts.dataPointIndex];
    //       return dataLabel !== undefined ? dataLabel : '';
    //     },
    //   },
    //   y: {
    //     labels: {
    //       formatter: function (value) {
    //         return value;
    //       },
          
    //     },
    //     title: {
    //       formatter: () => ""
    //     }
    //   },
    // },
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
    }));
    // console.log("Options Updated: ", dataLabels, xAxisHeader, yAxisHeader);
  }, [xValues, xAxisHeader, yAxisHeader, axisTitleStyle]);

  return (
    <div className="apex-chart" style={{ height: '100%', width: '100%', margin: "0" }}>
      <ReactApexChart options={options} series={yValues} type="area" height='100%' />
    </div>
  );
}
export default MultiLineChartBuilder; 