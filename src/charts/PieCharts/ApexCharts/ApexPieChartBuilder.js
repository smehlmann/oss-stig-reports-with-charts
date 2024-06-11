import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { palette } from "../../palette.js";

const ApexPieChartBuilder = ({ dataLabels, dataValues, title, legendTitle, onClick }) => {
  const [series, setSeries] = useState(dataValues);

  const [options, setOptions] = useState({
    chart: {
      type: 'pie',
      events: {
        dataPointSelection: onClick,
      },
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
    legend: {
      position: 'bottom',
      title: {
        text: legendTitle,
      },
    },
    dataLabels: {
      enabled: true,
    },
    responsive: [{
      breakpoint: 1000,
      options: {
        chart: {
           height: '100%',
           width : '100%',
        },
        legend: {
          position: 'bottom',
        }
      }
    }]
  });

  useEffect(() => {
    setSeries(dataValues);
  }, [dataValues]);

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      labels: dataLabels,
    }));
  }, [dataLabels]);

  return <Chart options={options} series={series} type="pie" style={{ height: '100%', width: '100%' }} />;
};

export default ApexPieChartBuilder;

/*

TRYING TO GET FILTERING LOGIC
const ApexPieChartBuilder = ({ dataLabels, dataValues, title, legendTitle, rawData }) => {
  const { filter, updateFilter } = useFilter();
  const [filteredData, setFilteredData] = useState(dataValues);

  useEffect(() => {
    if (Object.keys(filter).length > 0) {
      const filteredRawData = rawData.filter(item => {
        return Object.keys(filter).every(key => item[key] === filter[key]);
      });
      const filteredCountMap = ValueCountMap(filteredRawData, 'department'); // Adjust target column accordingly
      setFilteredData(Object.values(filteredCountMap));
    } else {
      setFilteredData(dataValues);
    }
  }, [filter, rawData, dataValues]);

  const handlePieClick = (event, chartContext, config) => {
    const selectedValue = config.w.config.labels[config.seriesIndex]; // Assuming label value is used for filtering
    updateFilter({ department: selectedValue }); // Adjust key according to the actual data structure
  };

  const [series, setSeries] = useState(filteredData);
  const [options, setOptions] = useState({
    chart: {
      type: 'pie',
      height: '100%',
      width: '100%',
      events: {
        dataPointSelection: handlePieClick, // Add event for handling clicks
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
        style: {
          fontSize: '15px',
          fontFamily: 'Segoe UI'
        },
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0],
      // style: {
      //   colors: ['#000000'] // Ensure data labels are dark
      // }
    },
    responsive: [{
      breakpoint: 1000,
      options: {
        chart: {
           height: '100%',
           width : '100%',
        },
        legend: {
          position: 'bottom',
        }
      }
    }]
  });

  useEffect(() => {
    setSeries(filteredData);
    setOptions((prevOptions) => ({
      ...prevOptions,
      labels: dataLabels,
    }));
  }, [filteredData, dataLabels]);

  return (
    <div className="apex-chart" style={{ height: '100%', width: '100%' }}>
      <Chart options={options} series={series} type="pie" />
    </div>
  );
};

export default ApexPieChartBuilder; 
*/