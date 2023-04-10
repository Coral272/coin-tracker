import { useQuery } from "react-query";
import styled from "styled-components";
import { fetchCoinTickers } from "./api";

const Overview = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const BigItem = styled.div`
  grid-column-start: 1;
  grid-column-end: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 10px;

  span {
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 5px;
  }
  strong {
    font-size: 36px;
  }
`;

const OverviewItem = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  text-transform: uppercase;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 10px;

  span {
    display: block;
    grid-column-start: 1;
    grid-column-end: 3;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 5px;
  }
  strong {
    display: block;
    font-size: 30px;
  }
  img {
    display: block;
    margin: 0 auto;
    width: 30px;
    height: auto;
  }
`;

interface PriceProps {
  coinId: string;
}

function Price({ coinId }: PriceProps) {
  const { isLoading, data } = useQuery(
    ["price info", coinId],
    () => fetchCoinTickers(coinId),
    {
      refetchInterval: 10000,
    }
  );
  function priceState(data: number) {
    let state;
    if (data > 0) {
      state = <img src={require("../assets/chart-arrow-rise.png")} />;
    } else if (data === 0) {
      state = <img src={require("../assets/chart-equal.png")} />;
    } else {
      state = <img src={require("../assets/chart-arrow-descent.png")} />;
    }
    return state;
  }
  return (
    <div>
      {isLoading ? (
        "Loading price info..."
      ) : (
        <Overview>
          <BigItem>
            <span>총 시가</span>
            <strong>{data?.quotes.USD.market_cap}</strong>
          </BigItem>
          <BigItem>
            <span>거래량(24h)</span>
            <strong>{data?.quotes.USD.volume_24h.toFixed(2)}</strong>
          </BigItem>
          <OverviewItem>
            <span>Change in 30 mins</span>
            <strong>{data?.quotes.USD.percent_change_30m}</strong>
            {priceState(data?.quotes.USD.percent_change_30m)}
          </OverviewItem>
          <OverviewItem>
            <span>Change in 1 hour</span>
            <strong>{data?.quotes.USD.percent_change_1h}</strong>
            {priceState(data?.quotes.USD.percent_change_1h)}
            {/* {data?.quotes.USD.percent_change_1h > 0 ? (
              <img src={require("../assets/chart-arrow-rise.png")} />
            ) : data?.quotes.USD.percent_change_1h == 0 ? (
              <img src={require("../assets/chart-equal.png")} />
            ) : (
              <img src={require("../assets/chart-arrow-descent.png")} />
            )} */}
          </OverviewItem>
          <OverviewItem>
            <span>Change in 6 hours</span>
            <strong>{data?.quotes.USD.percent_change_6h}</strong>
            {priceState(data?.quotes.USD.percent_change_6h)}
          </OverviewItem>

          <OverviewItem>
            <span>Change in 12 hours</span>
            <strong>{data?.quotes.USD.percent_change_12h}</strong>
            {priceState(data?.quotes.USD.percent_change_12h)}
          </OverviewItem>
          <OverviewItem>
            <span>Change in 24 hours</span>
            <strong>{data?.quotes.USD.percent_change_24h}</strong>
            {priceState(data?.quotes.USD.percent_change_24h)}
          </OverviewItem>
          <OverviewItem>
            <span>Change in 7 days</span>
            <strong>{data?.quotes.USD.percent_change_7d}</strong>
            {priceState(data?.quotes.USD.percent_change_7d)}
          </OverviewItem>
        </Overview>
      )}
    </div>
  );
}

export default Price;
