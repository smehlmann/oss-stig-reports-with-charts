import React, { useMemo, useEffect, useState, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
// import { palette } from "../../palette.js";
import { useTheme } from "../../../theme.js"


const GroupedChartBuilder = ({series, dataLabels, isHorizontal, xAxisHeader, yAxisHeader, onClick, formatLabelToPercentage}) => {
  const theme = useTheme();

  const options = useMemo(() => ({
    chart: {
      type: 'bar',
      height: '100%',
      width: '100%',
      events: {
        dataPointSelection: (event, chartContext, config) => {
          onClick(event, chartContext, config);
        },
      },
    },
    xaxis: {
      categories: dataLabels,
      title: { text: xAxisHeader },
    },
    yaxis: {
      title: { text: yAxisHeader },
    },
    plotOptions: {
      bar: {
        horizontal: isHorizontal,
        columnWidth: '34%',
      },
    },
    grid: {
      left: 400,

    },
    fill: {
      opacity: 1,
    },
    legend: {
      show: true,
    },
  }), [dataLabels, isHorizontal, xAxisHeader, onClick, yAxisHeader]);

  return (
    <div className="apex-chart" style={{ height: '100%', width: '100%' }}>
      <ReactApexChart options={options} series={series} type="bar" height='100%' />
    </div>
  );
};
export default GroupedChartBuilder;