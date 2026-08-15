import React from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface AttendanceManagementChartItem {
  date: string;
  present: number;
  absent: number;
  leave: number;
}

interface AttendanceManagementChartProps {
  data?: AttendanceManagementChartItem[];
}

const AttendanceManagementChart = ({ data = [] }: AttendanceManagementChartProps) => {
  const categories = data.map((item) => {
    const date = new Date(item.date);

    return new Intl.DateTimeFormat("fa-IR", {
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  });

  const series = [
    {
      name: "حضور",
      data: data.map((item) => item.present),
    },
    {
      name: "غیبت",
      data: data.map((item) => item.absent),
    },
    {
      name: "مرخصی",
      data: data.map((item) => item.leave),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
      fontFamily: "myFirstFont",
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },

    xaxis: {
      categories,

      labels: {
        style: {
          fontFamily: "myFirstFont",
        },
      },
    },

    yaxis: {
      title: {
        text: "تعداد کارکنان",
        style: {
          fontFamily: "myFirstFont",
        },
      },

      labels: {
        style: {
          fontFamily: "myFirstFont",
        },
      },
    },

    legend: {
      position: "top",
      horizontalAlign: "right",
      fontFamily: "myFirstFont",
    },

    tooltip: {
      y: {
        formatter: (value) => `${value} نفر`,
      },
    },

    grid: {
      strokeDashArray: 4,
    },
  };

  return (
    <div className="w-full">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default AttendanceManagementChart;
