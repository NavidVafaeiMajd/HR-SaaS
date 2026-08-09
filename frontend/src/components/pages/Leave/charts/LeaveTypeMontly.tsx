import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

interface LeaveTypeReport {
  leaveTypeId: string;
  leaveTypeName: string;
  requestCount: number;
  totalDays: number;
}

interface Props {
  data: LeaveTypeReport[];
}

const LeaveTypeMontly: React.FC<Props> = ({ data }) => {
  const categories = useMemo(
    () => data.map((item) => item.leaveTypeName),
    [data],
  );

  const series = useMemo(
    () => [
      {
        name: "مجموع روزهای مرخصی",
        data: data.map((item) => item.totalDays),
      },
    ],
    [data],
  );

  const options = useMemo(
    () => ({
      chart: {
        type: "bar" as const,
        height: 350,
        toolbar: {
          show: false,
        },
        fontFamily: "myFirstFont",
      },

      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 6,
          barHeight: "50%",
        },
      },

      dataLabels: {
        enabled: true,
        formatter: (value: number) => `${value} روز`,
      },

      xaxis: {
        categories,

        title: {
          text: "تعداد روز",
        },

        labels: {
          formatter: (value: string) => `${value}`,
        },
      },

      yaxis: {
        title: {
          text: "نوع مرخصی",
        },
      },

      tooltip: {
        y: {
          formatter: (value: number) => `${value} روز`,
        },
      },

      legend: {
        show: false,
      },

      grid: {
        strokeDashArray: 4,
      },
    }),
    [categories],
  );

  if (!data.length) {
    return (
      <div className="flex h-[350px] items-center justify-center text-gray-500">
        در این ماه مرخصی تاییدشده‌ای وجود ندارد
      </div>
    );
  }

  return (
    <ReactApexChart options={options} series={series} type="bar"     width="100%" height={350} />
  );
};

export default LeaveTypeMontly;
