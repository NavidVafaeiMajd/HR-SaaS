import React from "react";
import Chart from "react-apexcharts";

interface LeadPriorityData {
  priority: string;
  count: number;
}

interface LeadPriorityChartProps {
  data?: LeadPriorityData[];
}

const LeadPriorityChart: React.FC<LeadPriorityChartProps> = ({ data = [] }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Chart
        type="bar"
        series={[
          {
            name: "تعداد سرنخ‌ها",
            data: data.map((item) => item.count),
          },
        ]}
        options={{
          chart: {
            fontFamily: "myFirstFont",
            toolbar: {
              show: false,
            },
          },
          xaxis: {
            categories: data.map((item) => item.priority),
            labels: {
              style: {
                fontFamily: "myFirstFont",
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontFamily: "myFirstFont",
              },
            },
          },
          title: {
            text: "اولویت سرنخ‌ها",
            align: "right",
            style: {
              fontFamily: "myFirstFont",
            },
          },
          colors: ["#3b82f6"],
          dataLabels: {
            enabled: true,
            style: {
              fontFamily: "myFirstFont",
              fontWeight: "bold",
            },
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: false,
            },
          },
          responsive: [
            {
              breakpoint: 900,
              options: {
                plotOptions: {
                  bar: {
                    horizontal: true,
                  },
                },
              },
            },
          ],
        }}
      />
    </div>
  );
};

export default LeadPriorityChart;
