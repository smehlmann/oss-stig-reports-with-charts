import { useEffect, useState,} from "react";
import { palette } from "../../palette.js";
import numeral from "numeral";

import Chart from 'react-apexcharts';


const ApexDonutChartBuilder = ({dataLabels, dataValues, title, legendTitle}) => {
  const [series, setSeries] = useState(dataValues);
  const [options, setOptions] = useState({

    
  chart: {
    type: 'donut',
    height: '100%',
    width: '100%',
    events: {
      animationEnd: function (ctx) {
        ctx.toggleDataPointSelection(0);
      },
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
    position: 'bottom',
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
    enabledOnSeries: [0]
  },
  tooltip: {
    y: {
      formatter: function(value) {
        // Check if the value is less than 1 (interpreted as a percentage)
        if (value < 1) {
          return numeral(value * 100).format('0.00') + '%';
        }
        // Otherwise, return the value as is
        return value;
      }
    }
  },
  responsive: [{
    breakpoint: 1000,
    options: {
      chart: {
        // height: 200,
      },
      legend: {
        position: 'bottom',
      }
    }
  }],
  
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
    <div className = "apex-chart">
      <Chart options={options} series={series} type="donut" />
    </div>
  );
};

export default ApexDonutChartBuilder