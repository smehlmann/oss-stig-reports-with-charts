import { useEffect, useState,} from "react";
import { palette } from "../../../theme";
import numeral from "numeral";
import Chart from 'react-apexcharts';


const ApexDonutChartBuilder = ({dataLabels, dataValues, title, legendTitle, onClick}) => {
  const [series, setSeries] = useState(dataValues);
  const [options, setOptions] = useState({

  chart: {
    type: 'donut',
    height: '100%',
    width: '100%',
    //detects when data point is clicked
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
      fontSize: '25px',
      fontFamily: 'Segoe UI'
    },
  },
  plotOptions: {
    pie: {
      expandOnClick: true,
      dataLabels: {
        offset: 0,
        minAngleToShowLabel: 10
        
      }
    }
  },
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
    style: {
      fontSize: '13px',
      fontFamily: 'Segoe UI',
      fontWeight: 'bold',
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
    //  color: '#50068b',
    dropShadow: {
      enabled: true,
      top: 1,
      left: 1,
      blur: 1,
      opacity: 0.7,
    },
    formatter: function (val, { seriesIndex, w }) {
      const label = w.globals.labels[seriesIndex];
      return label;
    },
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
    <div className = "apex-chart" style={{ height: '100%', width: '100%' }}>
      <Chart options={options} series={series} type="donut" />
    </div>
  );
};

export default ApexDonutChartBuilder