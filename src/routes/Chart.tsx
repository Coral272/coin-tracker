import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

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
  const isDark = useRecoilValue(isDarkAtom);

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              data:
                data?.map((price) => ({
                  x: price.time_close * 1000,
                  y: [
                    parseFloat(price.open),
                    parseFloat(price.high),
                    parseFloat(price.low),
                    parseFloat(price.close),
                  ],
                })) ?? [],
            },
          ]}
          options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },
            chart: {
              height: 500,
              width: 500,
              toolbar: {
                show: false,
              },
            },
            plotOptions: {
              candlestick: {
                colors: {
                  upward: "#FA5252",
                  downward: "#20C997",
                },
              },
            },
            yaxis: {
              show: true,
            },
            xaxis: {
              type: "datetime",
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
