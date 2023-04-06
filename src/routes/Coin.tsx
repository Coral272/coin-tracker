import { Route, Switch, useLocation, useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import Price from "./Price";
import Chart from "./Chart";
import styled from "styled-components";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
`;
const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;
const Loader = styled.div`
  display: block;
  text-align: center;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 10px;
  padding: 12px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  span {
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 5px;
  }
  strong {
    font-size: 20px;
  }
`;

const Desc = styled.p`
  margin: 20px 0;
`;

interface RouteParams {
  coinId: string;
}

interface RouteState {
  name: string;
}

interface CoinInfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceInfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const [loading, setLoading] = useState(true);
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const [coinInfo, setCoinInfo] = useState<CoinInfoData>();
  const [priceInfo, setPriceInfo] = useState<PriceInfoData>();
  useEffect(() => {
    (async () => {
      const infoData = await (
        await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
      ).json();
      const priceData = await (
        await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
      ).json();
      setCoinInfo(infoData);
      setPriceInfo(priceData);
      setLoading(false);
    })();
  }, [coinId]);

  console.log(coinInfo);
  console.log(priceInfo);

  return (
    <Container>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : coinInfo?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Fragment>
          <Overview>
            <OverviewItem>
              <span>RANK:</span>
              <strong>{coinInfo?.rank}</strong>
            </OverviewItem>
            <OverviewItem>
              <span>SYMBOL:</span>
              <strong>${coinInfo?.symbol}</strong>
            </OverviewItem>
            <OverviewItem>
              <span>OPEN SOURCE:</span>
              <strong>{coinInfo?.open_source ? "YES" : "NO"}</strong>
            </OverviewItem>
          </Overview>

          <Desc>{coinInfo?.description}</Desc>

          <Overview>
            <OverviewItem>
              <span>TOTAL SUPLY:</span>
              <strong>{priceInfo?.total_supply}</strong>
            </OverviewItem>
            <OverviewItem>
              <span>MAX SUPPLY:</span>
              <strong>{priceInfo?.max_supply}</strong>
            </OverviewItem>
          </Overview>

          <Switch>
            <Route path={`/${coinId}/price`}>
              <Price />
            </Route>
            <Route path={`/${coinId}/chart`}>
              <Chart />
            </Route>
          </Switch>
        </Fragment>
      )}
    </Container>
  );
}

export default Coin;
