import { useEffect, useState,} from "react";
import { palette } from "../../../theme";
import numeral from "numeral";
import Chart from 'react-apexcharts';
import { useTheme } from "../../../theme.js"


const ApexDonutChartBuilder = ({dataLabels, dataValues, legendTitle, onClick, formatLabelToPercentage}) => {
  const [series, setSeries] = useState(dataValues);
  const theme = useTheme();

  //set color of bars based on bar's label
  const getColorForLabel = (label) => {
    switch(label) {
      case 'Assessed':
        // return '#581845';
        return theme.palette.assessed;
      case 'Submitted':
        return theme.palette.submitted;
      case 'Accepted':
        return theme.palette.accepted;
      case 'Rejected':
        return theme.palette.rejected;
      default:
        return theme.palette.primary.main;
    }
  };

  const barColors = dataLabels.map(label => getColorForLabel(label));
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
  colors: barColors,

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
      formatter: function (value) {
        if (formatLabelToPercentage) {
          return formatLabelToPercentage.formatter(value);
        }
        return value;
      },
    }
  },
  responsive: [{
    breakpoint: 1000,
    options: {
      chart: {
        height: '100%',
        width: '100%',
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
    <div className = "apex-chart" style={{ height:'100%', width: '100%', justifyContent: 'center', alignSelf: 'center'}}>
      <Chart options={options} series={series} type="donut" />
    </div>
  );
};

export default ApexDonutChartBuilder