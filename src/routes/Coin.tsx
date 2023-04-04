import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
    padding: 0px 20px;
    max-width: 480px;
    margin: 0 auto;
`

const Header = styled.header`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 10vh;
`
const Title = styled.h1`
    font-size: 48px;
    color:  ${props => props.theme.accentColor};
`
const Loader = styled.div`
    display: block;
    text-align: center;
`


interface RouteParams {
    coinId: string,
}

interface RouteState {
    name: string
}

function Coin() {
    const [loading, setLoading] = useState(true);
    const { coinId } = useParams<RouteParams>();
    const { state } = useLocation<RouteState>();
    const [coinInfo, setCoinInfo] = useState({});
    const [priceInfo, setPriceInfo] = useState({});
    useEffect(() => {
        (async() => {
            const infoData = await (
                await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
            ).json();
            const priceData = await (
                await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
            ).json();
            setCoinInfo(infoData);
            setPriceInfo(priceData);
        })();

    }, [])

    return (
        <Container>
            <Header>
            <Title>{state?.name || "Loading..."}</Title>
            </Header>
            {/* {loading ? (
                <Loader>Loading...</Loader>
            ) : (
                <span>{info}</span>
            )} */}
        </Container>
    )
}

export default Coin;