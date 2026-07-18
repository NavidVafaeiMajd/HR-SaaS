import React from "react";
import Chart from "react-apexcharts";

interface PipelineStageData {
  stage: string;
  count: number;
}

interface PipelineStageChartProps {
  data?: PipelineStageData[];
}

const PipelineStageChart: React.FC<PipelineStageChartProps> = ({ data = [] }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Chart
        type="area"
        series={[
          {
            name: "تعداد کاریزها",
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
            categories: data.map((item) => item.stage),
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
            text: "مراحل کاریز",
            align: "right",
            style: {
              fontFamily: "myFirstFont",
            },
          },
          colors: ["#10b981"],
          dataLabels: {
            enabled: true,
            style: {
              fontFamily: "myFirstFont",
              fontWeight: "bold",
            },
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.9,
              stops: [0, 90, 100],
            },
          },
          stroke: {
            curve: "smooth",
            width: 2,
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

export default PipelineStageChart;
