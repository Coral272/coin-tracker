import { useQuery } from "react-query";
import { fetchCoinHistory } from "./api";
import ApexChart from "react-apexcharts";

interface ChartProps {
  coinId: string;
}

interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    }
  );
  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: "price",
              data: data?.map((price) => parseFloat(price.close)) ?? [],
              // ??(null병합 연산자)는 왼쪽 피연산자가 null || undefined 일때 오른쪽 피연산자를 반환
              // ApexChart에 들어가는 data는 number여야 하는데, data를 못받아왔을 때(undefined)의 경우(빈 배열을 반환)도 처리하는 것임
            },
          ]}
          options={{
            theme: {
              mode: "dark",
            },
            stroke: {
              curve: "smooth",
            },
            grid: {
              show: true,
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              labels: { show: false },
              axisBorder: { show: false },
              axisTicks: { show: false },
              type: "datetime",
              categories: data?.map((price) => price.time_close * 1000),
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#0fbcf9"] },
            },
            colors: ["#0be881"],
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
            chart: {
              toolbar: { show: false },
              height: 500,
              width: 500,
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
