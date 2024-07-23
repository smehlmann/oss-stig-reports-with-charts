import ValueCountMap from "../../../components/ValueCountMap.js";
import { useFilter } from "../../../FilterContext.js";
import React, { useMemo, useEffect, useState, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
// import { palette } from "../../palette.js";
import { useTheme } from "../../../theme.js"
import dayjs from 'dayjs';

const convertStringsToDates = (dateStrings) => {
  return dateStrings.map(dateString => new Date(dateString));
};

const DateBar = ({ targetColumn, isHorizontal, chartTitle, xAxisTitle, yAxisTitle, data }) => {
  const { filter, updateFilter } = useFilter();

  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) { 
      const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
      return filtered;
    }
    return data;
  }, [filter, data]);

  // const vals = filteredData.map(item => item[targetColumn])
  // vals.forEach(item => {
  //   console.log(item instanceof Date)
  // })

  //ValueCountMap -> count the number of times a value appears in the targetColumn
  const countMap = useMemo(() => ValueCountMap(filteredData, targetColumn), [filteredData, targetColumn]);

  // let barLabels = useMemo(() => Object.keys(countMap), [countMap]); //labels = array of values in targetColumn
  // barLabels = useMemo(() => convertStringsToDates(barLabels), [barLabels]);  
  const barValues = useMemo(() => Object.values(countMap), [countMap]); //array of number of times a label appears

  const barLabels = useMemo(() => {
    const countMap = ValueCountMap(filteredData, targetColumn);
    return Object.keys(countMap);
  }, [filteredData, targetColumn]);
  // const barDates = useMemo(() => convertStringsToDates(barLabels), [barLabels]);

  console.log('barLabels: ', barLabels);

  //updates the filter criteria based on user's click
  const handleBarClick = (event, chartContext, config) => {
    console.log("globals: ", config);
    const timestamps = config.w.globals.labels || config.w.globals.categories;
  
    // Convert timestamps to date strings
    const formattedDates = timestamps.map(timestamp => new Date(timestamp).toString());
  
    console.log('Formatted Dates:', formattedDates);
  
    const selectedTimestamp = timestamps[config.dataPointIndex];
    const selectedDate = new Date(selectedTimestamp).toString();

      if (selectedDate) {
      // Check if the selected value is already in the filter
      if (filter[targetColumn] === selectedDate) {
        // Remove the filter
        updateFilter({ [targetColumn]: undefined });
      } else {
        // Add the filter
        updateFilter({ [targetColumn]: selectedDate });
      }
    }
  };


  return (
    // <div style={{width: '100%', height: '100%'}}>
      // {barValues.map((val, index) => (
      //   <div key={index}>
      //     <body1>Name: {barLabels[index]} </body1><br></br>
      //     <body2>Count: {val}</body2>
      //     <hr />
      //   </div>
      // ))} 

      <DateBuilder
        dataLabels={barLabels}
        dataValues={barValues}
        title={chartTitle}
        isHorizontal={isHorizontal}
        xAxisHeader={xAxisTitle}
        yAxisHeader={yAxisTitle}
        onClick={handleBarClick}
      />
    // </div>
  );
};
export default DateBar;

const DateBuilder = ({ dataLabels, dataValues, isHorizontal, xAxisHeader, yAxisHeader, onClick, formatLabelToPercentag=false}) => {
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
      events: {
        dataPointSelection: onClick,
      },
      // events: {
      //   dataPointSelection: (event, chartContext, config) => {
      //     // console.log("Data Point Selected: ", config);
      //     // console.log("Selected Data Labels: ", dataLabels);
      //     onClick(event, chartContext, config);
      //   },
      // },
      toolbar: {
        
        show: true,
        offsetX: 0,
        autoScaleYaxis: true,        
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
          autoScaleYaxis: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      // tickPlacement: 'on',
      type: 'datetime',
      categories: dataLabels,
      title: {
        text: xAxisHeader,
        style: axisTitleStyle,
      },
      tickAmount: dataValues.length > 5 ? undefined : dataValues.length, // set tickAmount based on data length
      // labels: {
      //   formatter: (value) => {
      //     // Format the value using dayjs or any other date library
      //     return dayjs(value).format('MMM DD'); // Format as "Jul 09"
      //   },
      // },
    },
    yaxis: {
      title: {
        text: yAxisHeader,
        style: axisTitleStyle,
      },
      labels: {
        formatter: function (value) {
          // if (formatLabelToPercentage) {
          //   return formatLabelToPercentage.formatter(value);
          // }
          return value;
        },
      },
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
    
      y: {
        labels: {
          formatter: function (value) {
            // if (formatLabelToPercentage) {
            //   return formatLabelToPercentage.formatter(value);
            // }
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

