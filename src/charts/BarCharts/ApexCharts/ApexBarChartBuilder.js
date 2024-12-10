import React, { useMemo, useEffect, useState, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import { useTheme } from "../../../theme.js"
import { useBarChartStyles } from './useBarChartStyles.js';


const ApexBarChartBuilder = ({ dataLabels, dataValues, dataLabelsArePercentages, tooltipLabelPrefix, isHorizontal, xAxisHeader, yAxisHeader, onClick}) => {
  const theme = useTheme();

  //styles from custom hook
  const {
    axisTitleStyle, 
    dataLabelPercentageFormatter,  
    dataLabelsOnBarText, 
    dataLabelsOnBarBackground, 
    dataLabelsOnBarDropShadow,
    getColorForLabel,
    axisLabelsStyles,
    tooltipXFormatter,
    tooltipYFormatter, 
    tooltipYTitleFormatter
  } = useBarChartStyles(dataLabelsArePercentages, [], false);

  // Combine data values with their corresponding labels
  const seriesData = dataValues.map((value, index) => ({
    x: dataLabels[index],
    y: value,
  }));

  const [series, setSeries] = useState([
    { name: xAxisHeader, data: seriesData },
  ]);

  const barColors = useMemo(
    () => dataLabels.map((label) => getColorForLabel(label)),
    [dataLabels, getColorForLabel]
  );

  // Base options with dynamic orientation adjustments
  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      height: '100%',
      width: '100%',
      justifyContent:'center',
      alignItems: 'center',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
        },
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          onClick?.(event, chartContext, config);
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (value) => dataLabelPercentageFormatter(value),
      style: dataLabelsOnBarText,
      background: dataLabelsOnBarBackground,
      dropShadow: dataLabelsOnBarDropShadow,
    },
    xaxis: {
      type: isHorizontal ? 'numeric' : 'category',
      ...(!isHorizontal && {
        categories: dataLabels, 
      }),
      title: {
        text: xAxisHeader,
        style: {
          ...axisTitleStyle,
        },
      },
      labels: {
        formatter: (value) => dataLabelPercentageFormatter(value),
        style: {
          ...axisLabelsStyles,
          cssClas: 'apexcharts-xaxis-label',
        }
      },
      tickAmount: dataValues.length > 4 ? undefined : dataValues.length,
    },
    yaxis: {
      type: isHorizontal ? 'category' : 'numeric',
      ...(isHorizontal && {
        categories: dataLabels, 
      }),
      title: {
        text: yAxisHeader,
        style: axisTitleStyle,
      },
      labels: {
        formatter:  (value) => dataLabelPercentageFormatter(value),
        ...(isHorizontal && {
          // offsetX: 15, // horizontal positioning of labels
          // offsetY: 20, // vertical positioning of labels
        }),
        style: {
          ...axisLabelsStyles,
          cssClas: 'apexcharts-yaxis-label',
        },
      },
    },
    
    fill: {
      opacity: 1,
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      x: {
        formatter: tooltipXFormatter
      },
      y: {
        formatter: tooltipYFormatter,
        title: {
          formatter: tooltipYTitleFormatter,
        }
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: isHorizontal,
        columnWidth: '34%',
        colors: {
          backgroundBarOpacity: 1,
          opacity: 1,
        },
      },
    },
    colors: barColors,
    //adjust grid area if horizontal chart
    ...(isHorizontal && {
      grid: {
        left: 400,
      }
    }),
    legend: {
      show: false,
    },

  });

  //update series and options on prop changes
  useEffect(() => {
    const updatedSeriesData = dataValues.map((value, index) => ({
      x: dataLabels[index],
      y: value,
      fillColor: getColorForLabel(dataLabels[index]),
    }));
    setSeries([{ name: xAxisHeader, data: updatedSeriesData }]);
  }, [dataLabels, dataValues, getColorForLabel, isHorizontal, xAxisHeader, yAxisHeader]);

  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      xaxis: {
        ...prev.xaxis,
        type: isHorizontal ? 'numeric' : 'category',
        ...(!isHorizontal && {
          categories: dataLabels, 
        }),
        title: { text: xAxisHeader, style: axisTitleStyle },
      },
      yaxis: {
        ...prev.yaxis,
        title: {
          text: yAxisHeader, style: axisTitleStyle 
        },
        //if isHorizontal is true
        ...(isHorizontal && {
          labels: {
            maxWidth: '50%', //enough to fully display labels
            offsetX: 3,
            
            style: {
              ...axisLabelsStyles,
              cssClas: 'apexcharts-yaxis-label',
              paddingBottom: 20,
            },
          }
        })
      },
      colors: barColors,
    }));
  }, [dataLabels, dataValues, axisTitleStyle, barColors, isHorizontal, xAxisHeader, yAxisHeader]);


  const chartHeight = Math.max(400, dataLabels.length * 26); //ensures that each row in chart is 24px in height
  
  return (
    <div className="apex-chart" style={{ height: '100%', width: '100%' }}>
      <ReactApexChart 
        options={options} 
        series={series} 
        type="bar" 
        height={chartHeight} 
      />
    </div>
  );
};

export default ApexBarChartBuilder;



