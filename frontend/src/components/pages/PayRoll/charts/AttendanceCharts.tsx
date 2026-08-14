import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface AttendanceSummary {
  totalDays: number;

  presentDays: number;
  absentDays: number;
  leaveDays: number;

  totalWorkedMinutes: number;
  totalLateMinutes: number;
  totalEarlyLeaveMinutes: number;
  totalOvertimeMinutes: number;
}

interface AttendanceChartsProps {
  summary: AttendanceSummary;
}

const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} دقیقه`;
  }

  if (remainingMinutes === 0) {
    return `${hours} ساعت`;
  }

  return `${hours} ساعت و ${remainingMinutes} دقیقه`;
};

const AttendanceCharts = ({ summary }: AttendanceChartsProps) => {
  // ==========================================
  // Chart 1
  // ==========================================

  const attendanceSeries = [
    summary.presentDays,
    summary.absentDays,
    summary.leaveDays,
  ];

  const formatDays = (days: number) => {
    return `${days} روز`;
  };
  
const attendanceOptions: ApexOptions = {
  chart: {
    type: "donut",
    width: "100%",
    fontFamily: "myFirstFont",
  },

  labels: ["حضور", "غیبت", "مرخصی"],

  colors: ["#0EA5E9", "#F43F5E", "#14B8A6"],

  plotOptions: {
    pie: {
      borderRadius: 12,
      spacing: 5,
      offsetX: 0,

      donut: {
        size: "80%",

        labels: {
          show: true,

          // وقتی روی یک قسمت Hover می‌کنی
          name: {
            show: true,
            fontSize: "12px",
            fontFamily: "myFirstFont",
          },

          // مقدار وسط Donut
          value: {
            show: true,
            fontSize: "18px",
            fontFamily: "myFirstFont",

            formatter: (value) => {
              return formatDays(Number(value));
            },
          },

          // حالت عادی که چیزی Hover نشده
          total: {
            show: true,
            label: "کل روزها",

            fontSize: "12px",
            fontFamily: "myFirstFont",

            formatter: () => {
              return formatDays(summary.totalDays);
            },
          },
        },
      },
    },
  },

  stroke: {
    width: 0,
  },

  dataLabels: {
    enabled: false,
  },

  // Legend خود ApexCharts خاموش است
  legend: {
    show: false,
  },

  title: {
    text: "وضعیت حضور و غیاب",
    align: "right",

    style: {
      fontSize: "14px",
      fontFamily: "myFirstFont",
    },
  },

  // Tooltip هنگام Hover
  tooltip: {
    y: {
      formatter: (value) => {
        return formatDays(value);
      },
    },

    style: {
      fontSize: "12px",
      fontFamily: "myFirstFont",
    },
  },

  responsive: [
    {
      breakpoint: 480,

      options: {
        chart: {
          width: 320,
        },

        plotOptions: {
          pie: {
            offsetX: 0,
          },
        },
      },
    },
  ],
};
  // ==========================================
  // Chart 2
  // ==========================================

  const timeSeries = [
    summary.totalWorkedMinutes,
    summary.totalLateMinutes,
    summary.totalOvertimeMinutes,
    summary.totalEarlyLeaveMinutes,
  ];

  const timeOptions: ApexOptions = {
    chart: {
      type: "donut",
      width: "100%",
      fontFamily: "myFirstFont",
    },

    labels: ["کارکرد", "تأخیر", "اضافه‌کاری", "ترک زودهنگام"],

    colors: ["#0EA5E9", "#F59E0B", "#14B8A6", "#F43F5E"],

    plotOptions: {
      pie: {
        borderRadius: 12,
        spacing: 5,
        offsetX: 0,
        donut: {
          size: "80%",

          labels: {
            show: true,

            name: {
              show: true,
              fontSize: "12px",
              fontFamily: "myFirstFont",
            },

            value: {
              show: true,
              fontSize: "14px",
              fontFamily: "myFirstFont",
              formatter: (value) => {
                return formatMinutes(Number(value));
              },
            },
            total: {
              show: true,
              label: "مجموع کارکرد",

              formatter: () => {
                return formatMinutes(summary.totalWorkedMinutes);
              },
            },
          },
        },
      },
    },

    stroke: {
      width: 0,
    },

    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },

    title: {
      text: "آمار زمانی",
      align: "right",
    },

    tooltip: {
      y: {
        formatter: (value) => {
          return formatMinutes(value);
        },
      },
    },

    responsive: [
      {
        breakpoint: 480,

        options: {
          chart: {
            width: 320,
          },
          plotOptions: {
            pie: {
              offsetX: 0,
            },
          },
        },
      },
    ],
  };

  return (
    <div className="flex flex-col xl:flex-row justify-center items-center gap-6">
      <div className="w-full min-w-0">
        <ReactApexChart
          options={attendanceOptions}
          series={attendanceSeries}
          type="donut"
          width="100%"
        />
      </div>

      <div className="w-full overflow-hidden">
        <ReactApexChart
          options={timeOptions}
          series={timeSeries}
          type="donut"
          width="100%"
        />
      </div>
    </div>
  );
};

export default AttendanceCharts;
