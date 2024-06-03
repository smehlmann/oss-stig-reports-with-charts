import { useEffect, useState, useRef } from "react";
import { circularChartFill, palette } from "../palette.js";

import Chart from 'react-apexcharts';


const ApexPieChartBuilder = ({dataLabels, dataValues, title, legendTitle}) => {
  console.log('Rendering PieChartBuilder');
  const [series, setSeries] = useState(dataValues);
  const [options, setOptions] = useState({

    
  chart: {
    type: 'pie',
    events: {
      animationEnd: function (ctx) {
        ctx.toggleDataPointSelection(0);
      },
    },
    toolbar: {
      show: true,
    }
  },
  labels: dataLabels,
  colors: palette,
  title: {
    text: title,
    align: 'center',
    style: {
      fontSize: '30px',
      fontFamily: 'Segoe UI'
    },
  },
  // plotOptions: {
  //   pie: {
  //     expandOnClick: true,
  //     dataLabels: {
  //       offset: 0,
  //       minAngleToShowLabel: 10
  //     }
  //   }
  // },
  legend: {
    show: true,
    position: 'right',
    labels: {
      colors: '#000',
      useSeriesColors: false,
    },
    title: {
      text: legendTitle,
      side: 'left',
    },
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [0, 1, 2]
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      // legend: {
      //   position: 'bottom',
      // }
    }
  }]
});

  useEffect(() => {
    //updating state so series=dataValues
    setSeries(dataValues);
    //updating state of options so labels be changed if
    setOptions((prevOptions) => ({
      ...prevOptions,
      labels: dataLabels,
    }));
  }, [dataLabels, dataValues]);

  return (
    <div>
      <Chart options={options} series={series} type="pie" />
    </div>
  );
};

export default ApexPieChartBuilder;
