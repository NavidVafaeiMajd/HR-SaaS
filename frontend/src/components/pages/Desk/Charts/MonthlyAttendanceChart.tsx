import React from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

type MonthlyAttendanceChartProps = {
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  workedDays: number;
  totalWorkedHours: number;
  totalOvertimeHours: number;
};

const MonthlyAttendanceChart = ({
  presentDays,
  absentDays,
  leaveDays,
  workedDays,
  totalWorkedHours,
  totalOvertimeHours,
}: MonthlyAttendanceChartProps) => {
  const series = [
    {
      name: "تعداد روز",
      data: [presentDays, leaveDays, absentDays],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
      fontFamily: "myFirstFont",
    },

    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        borderRadiusApplication: "end",
        barHeight: "45%",
      },
    },

    dataLabels: {
      enabled: true,
      formatter: (value) => `${value} روز`,
    },

    xaxis: {
      categories: ["حضور", "مرخصی", "غیبت"],

      labels: {
        formatter: (value) => `${value}`,
      },
    },

    yaxis: {
      labels: {
        style: {
          fontFamily: "myFirstFont",
        },
      },
    },

    grid: {
      strokeDashArray: 4,
    },

    tooltip: {
      y: {
        formatter: (value) => `${value} روز`,
      },
    },

    legend: {
      show: false,
    },
  };

  return (
    <section className="rounded-2xl border bg-card p-5">
      <div>
        <h3 className="text-lg font-bold">وضعیت حضور این ماه</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          خلاصه وضعیت حضور و غیاب شما در ماه جاری
        </p>
      </div>

      <div className="mt-4">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={220}
        />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">روزهای کاری</p>

          <p className="mt-1 text-lg font-bold">{workedDays} روز</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">مجموع ساعت کاری</p>

          <p className="mt-1 text-lg font-bold">{totalWorkedHours} ساعت</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">اضافه‌کاری</p>

          <p className="mt-1 text-lg font-bold">{totalOvertimeHours} ساعت</p>
        </div>
      </div>
    </section>
  );
};

export default MonthlyAttendanceChart;
