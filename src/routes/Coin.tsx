import {
  Link,
  Route,
  Switch,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

import Price from "./Price";
import Chart from "./Chart";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "./api";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 15vh;
  padding: 10px 10px;
  ::after {
    width: 40px;
    height: 40px;
    content: "";
  }
`;
const Title = styled.h1`
  font-size: 32px;
  font-weight: 400;
  text-align: center;
  color: ${(props) => props.theme.accentColor};
`;
const GoHome = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${(props) => props.theme.itemColor};
  border: none;
  border-radius: 50%;
  a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    img {
      display: block;
      width: 20px;
      height: 20px;
      margin: 0 auto;
    }
  }
`;
const Loader = styled.div`
  display: block;
  text-align: center;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: ${(props) => props.theme.itemColor};
  border: none;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 20px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;

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
  margin-bottom: 20px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-weight: 600;
  padding: 7px 0;
  background-color: ${(props) => props.theme.itemColor};
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
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

interface ICoinProps {}

function Coin({}: ICoinProps) {
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");
  const { isLoading: infoLoading, data: infoData } = useQuery<CoinInfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId),
    {
      refetchInterval: 5000,
    }
  );
  const { isLoading: tickersLoading, data: tickersData } =
    useQuery<PriceInfoData>(["tickers", coinId], () =>
      fetchCoinTickers(coinId)
    );
  const isDark = useRecoilValue(isDarkAtom);

  const loading = infoLoading || tickersLoading;
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <GoHome>
          <Link to={`/`}>
            {isDark ? (
              <img src={require("../assets/icon-home-dark-mode.png")} />
            ) : (
              <img src={require("../assets/icon-home-light-mode.png")} />
            )}
          </Link>
        </GoHome>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Fragment>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <strong>{infoData?.rank}</strong>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <strong>${infoData?.symbol}</strong>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <strong>${tickersData?.quotes.USD.price.toFixed(2)}</strong>
            </OverviewItem>
          </Overview>

          <Desc>{infoData?.description}</Desc>

          <Overview>
            <OverviewItem>
              <span>TOTAL SUPLY:</span>
              <strong>{tickersData?.total_supply}</strong>
            </OverviewItem>
            <OverviewItem>
              <span>MAX SUPPLY:</span>
              <strong>{tickersData?.max_supply}</strong>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab isActive={chartMatch != null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch != null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Tabs>

          <Switch>
            <Route path="/:coinId/chart">
              <Chart coinId={coinId} />
            </Route>
            <Route path="/:coinId/price">
              <Price coinId={coinId} />
            </Route>
          </Switch>
        </Fragment>
      )}
    </Container>
  );
}

export default Coin;
