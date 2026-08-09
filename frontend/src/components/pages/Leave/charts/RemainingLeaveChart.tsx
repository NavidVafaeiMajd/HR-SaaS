import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface RemainingLeave {
  leaveTypeId: string;
  leaveTypeName: string;
  annualLimit: number;
  usedDays: number;
  remainingDays: number;
}

interface Props {
  data: RemainingLeave[];
}

const RemainingLeaveChart: React.FC<Props> = ({ data }) => {
  const series = useMemo(
    () => [
      {
        name: "استفاده شده",
        data: data.map((item) => item.usedDays),
      },
      {
        name: "باقی مانده",
        data: data.map((item) => item.remainingDays),
      },
    ],
    [data],
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
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
        },
      },

      xaxis: {
        categories: data.map((item) => item.leaveTypeName),
      },

      yaxis: {
        title: {
          text: "تعداد روز",
        },
        min: 0,
        forceNiceScale: true,
      },

      dataLabels: {
        enabled: true,
      },

      tooltip: {
        y: {
          formatter: (value) => `${value} روز`,
        },
      },

      legend: {
        position: "top",
        horizontalAlign: "right",
      },
      noData: {
        text: "اطلاعاتی برای نمایش وجود ندارد",
      },
    }),
    [data],
  );

  return (
    <div className="w-full rounded-xl bg-white p-5">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default RemainingLeaveChart;
