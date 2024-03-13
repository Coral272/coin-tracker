import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

import styled from "styled-components";
import { fetchCoins } from "./api";

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
  ::before {
    width: 40px;
    height: 40px;
    content: "";
  }
`;

const ThemeToggle = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: ${(props) => props.theme.itemColor};
  border: none;
  border-radius: 50%;
  img {
    display: block;
    width: 30px;
    height: 30px;
    margin: 0 auto;
  }
`;

const CoinList = styled.ul``;

const Coin = styled.li`
  background-color: ${(props) => props.theme.itemColor};
  color: ${(props) => props.theme.textColor};
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 10px;
  a {
    display: flex;
    justify-content: start;
    align-items: center;
    transition: color 0.1s ease-in;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 400;
  text-align: center;
  color: ${(props) => props.theme.accentColor};
`;
const Loader = styled.div`
  display: block;
  text-align: center;
`;
const Img = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 10px;
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

interface ICoinsProps {}

function Coins({}: ICoinsProps) {
  const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);
  const isDark = useRecoilValue(isDarkAtom);
  const setIsDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setIsDarkAtom((current) => !current);

  return (
    <Container>
      <Helmet>
        <title>Coins</title>
      </Helmet>

      <Header>
        <Title>Coins</Title>
        <ThemeToggle onClick={toggleDarkAtom}>
          {isDark ? (
            <img src={require("../assets/icon-dark-mode.png")} />
          ) : (
            <img src={require("../assets/icon-light-mode.png")} />
          )}
        </ThemeToggle>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={{
                  pathname: `/${coin.id}`,
                  state: { name: coin.name },
                }}
              >
                <Img
                  src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinList>
      )}
    </Container>
  );
}

export default Coins;
