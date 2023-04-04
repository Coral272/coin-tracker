import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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

const CoinList = styled.ul`
    
`

const Coin = styled.li`
    background-color: white;
    color: ${props => props.theme.bgColor};
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 10px;
    a {
        display: flex;
        justify-content: start;
        align-items: center;
        transition: color 0.1s ease-in;
        display: block
    }
    &:hover {
        a {
            color: ${props => props.theme.accentColor};
        }
    }
`

const Title = styled.h1`
    font-size: 48px;
    color:  ${props => props.theme.accentColor};
`
const Loader = styled.div`
    display: block;
    text-align: center;
`
const Img = styled.img`
    width: 25px;
    height: 25px;
    margin-right: 10px;
`

interface CoinInterface {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;

}
function Coins() {
    const [coins, setCoins] = useState<CoinInterface[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async() => {
            const res = await fetch("https://api.coinpaprika.com/v1/coins");
            const json = await res.json();
            setCoins(json.slice(0, 100));
            setLoading(false);
        })();
    }, []);
    console.log(coins);
    return (
        <Container>
            <Header>
            <Title>Coins</Title>
            </Header>
            {loading ? (
                <Loader>Loading...</Loader>
            ) : (
            <CoinList>
                {coins.map(coin =>(
                    <Coin key={coin.id}>
                        <Link to={{
                                pathname: `/${coin.id}`,
                                state: { name: coin.name},
                        }}>
                            <img src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase}`} />
                            {coin.name} &rarr;
                        </Link>
                    </Coin>
                ))}
            </CoinList>
            )}
        </Container>
    )
}

export default Coins;