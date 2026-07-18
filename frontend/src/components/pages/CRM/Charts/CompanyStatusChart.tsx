import React from "react";
import Chart from "react-apexcharts";

interface CompanyStatusData {
  name: string;
  count: number;
}

interface CompanyStatusChartProps {
  data?: CompanyStatusData[];
}

const CompanyStatusChart: React.FC<CompanyStatusChartProps> = ({ data = [] }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Chart
        type="donut"
        series={data.map((item) => item.count)}
        options={{
          chart: {
            fontFamily: "myFirstFont",
          },
          dataLabels: {
            enabled: true,
            style: {
              fontFamily: "myFirstFont",
              fontWeight: "bold",
            },
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: "جمع کل",
                    formatter: function (w) {
                      return w.globals.seriesTotals
                        .reduce((a: number, b: number) => {
                          return a + b;
                        }, 0)
                        .toLocaleString();
                    },
                  },
                },
              },
            },
          },
          labels: data.map((item) => item.name),
          title: {
            text: "وضعیت شرکت‌ها",
            align: "right",
            style: {
              fontFamily: "myFirstFont",
            },
          },
          colors: ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
          legend: {
            horizontalAlign: "center",
            position: "right",
          },
          responsive: [
            {
              breakpoint: 900,
              options: {
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        }}
      />
    </div>
  );
};

export default CompanyStatusChart;
