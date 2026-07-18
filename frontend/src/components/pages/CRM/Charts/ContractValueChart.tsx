import React from "react";
import Chart from "react-apexcharts";

interface ContractValueData {
  month: string;
  value: number;
}

interface ContractValueChartProps {
  data?: ContractValueData[];
}

const ContractValueChart: React.FC<ContractValueChartProps> = ({ data = [] }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Chart
        type="line"
        series={[
          {
            name: "ارزش قراردادها",
            data: data.map((item) => item.value),
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
            categories: data.map((item) => item.month),
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
              formatter: function (value) {
                return value.toLocaleString() + " تومان";
              },
            },
          },
          title: {
            text: "ارزش قراردادها در ماه",
            align: "right",
            style: {
              fontFamily: "myFirstFont",
            },
          },
          colors: ["#f59e0b"],
          dataLabels: {
            enabled: true,
            style: {
              fontFamily: "myFirstFont",
              fontWeight: "bold",
            },
          },
          stroke: {
            curve: "smooth",
            width: 3,
          },
          markers: {
            size: 6,
            hover: {
              size: 8,
            },
          },
          responsive: [
            {
              breakpoint: 900,
              options: {
                chart: {
                  height: 300,
                },
              },
            },
          ],
        }}
      />
    </div>
  );
};

export default ContractValueChart;
