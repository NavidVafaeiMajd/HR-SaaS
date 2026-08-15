import React from "react";
import ReactApexChart from "react-apexcharts";

type PayrollChartItem = {
  year: number;
  month: number;
  monthName: string;
  amount: {
    source: string;
    parsedValue: number;
  };
};

type PayrollChartProps = {
  data?: PayrollChartItem[];
};

const PayrollChart = ({ data = [] }: PayrollChartProps) => {
  const series = [
    {
      name: "مبلغ حقوق",
      data: data.map((item) => item.amount),
    },
  ];

  const options: ApexCharts.ApexOptions = {
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
        columnWidth: "45%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: data.map((item) => item.monthName),

      labels: {
        style: {
          fontFamily: "myFirstFont",
        },
      },
    },

    yaxis: {
      labels: {
        formatter: (value) => {
          return `${value.toLocaleString("fa-IR")}`;
        },

        style: {
          fontFamily: "myFirstFont",
        },
      },

      title: {
        text: "مبلغ حقوق (تومان)",
        style: {
          fontFamily: "myFirstFont",
        },
      },
    },

    tooltip: {
      y: {
        formatter: (value) => {
          return `${value.toLocaleString("fa-IR")} تومان`;
        },
      },
    },

    grid: {
      strokeDashArray: 4,
    },
  };

  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="mb-5">
        <h3 className="text-lg font-bold">روند پرداخت حقوق</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          مجموع مبلغ حقوق پرداخت‌شده در شش ماه گذشته
        </p>
      </div>

      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default PayrollChart;
