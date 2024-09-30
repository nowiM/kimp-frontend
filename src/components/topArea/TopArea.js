import React, { useEffect, useState } from 'react';
import triangle_icon from '../images/triangle_icon.svg';
import './TopArea.css'

const TopArea = () => {
    const [marketData, setMarketData] = useState({ 
        totalKrwCoins: null, usdToKrwExchangeRate: null, 
        totalMarketCapUsd: null, marketCapChangePercent: null,
        totalVolume24hUsd: null, volumeChangePercent: null,
        btcDominance: null, ethDominance: null,
    });

    const fetchKrwCoinCount = async () => {
        const upbitUrl = `${process.env.REACT_APP_BACKEND_URL}api/krwCoinCount`;

        try {
            const response = await fetch(upbitUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
    
            const krwMarket = data.filter(coin => coin.market.startsWith('KRW'));

            setMarketData(prevState => ({
                ...prevState,
                totalKrwCoins: krwMarket.length
            }));
        } catch (error) {
            console.error("Failed to fetch Upbit data:", error);
        }
    };

    const fetchUsdToKrwExchangeRate = async () => {
        const exchangeRateUrl = `${process.env.REACT_APP_BACKEND_URL}api/usdToKrwExchangeRate`;
        
        try {
            const response = await fetch(exchangeRateUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setMarketData(prevState => ({
                ...prevState,
                usdToKrwExchangeRate: Math.floor(data.usd.krw * 100) / 100,
            }));
        } catch (error) {
            console.error("Failed to fetch exchange rate:", error);
        }
    };

    const fetchGlobalMarketData = async () => {
        const globalMetricsUrl = `${process.env.REACT_APP_BACKEND_URL}/api/globalMarketData`;
        
        try {
            const response = await fetch(globalMetricsUrl);
            const data = await response.json();

            setMarketData(prevState => ({
                ...prevState,
                totalMarketCapUsd: data.data.quote.USD.total_market_cap, // 총 시가총액
                marketCapChangePercent: data.data.quote.USD.total_market_cap_yesterday_percentage_change, // 시간총액 변동율
                totalVolume24hUsd: data.data.quote.USD.total_volume_24h, // 총 거래량 
                volumeChangePercent: data.data.quote.USD.total_volume_24h_yesterday_percentage_change, // 거래량 변동율
                btcDominance: data.data.btc_dominance, // 비트코인 도미넌스
                ethDominance: data.data.eth_dominance, // 이더리움 도미넌스
            }));
        } catch (error) {
            console.error("Failed to fetch global market data:", error);
        }
    };

    useEffect(() => {
        fetchKrwCoinCount();
        fetchUsdToKrwExchangeRate();
        fetchGlobalMarketData(); //API 요청 제한 때문에 주석 처리함
    }, []);

    const priceDirectionTotalMarket = marketData.marketCapChangePercent !== null && marketData.marketCapChangePercent > 0 ? 'rise' : 'fall';
    const priceDirectionTotalVolue = marketData.volumeChangePercent !== null && marketData.volumeChangePercent > 0 ? 'rise' : 'fall';

    return (
        <div className='container'>
            <span className='item'>
                <span className='title'>코인: </span>
                <span className='value'>
                    {marketData.totalKrwCoins !== null ? marketData.totalKrwCoins : 'Loading...'}
                </span>
            </span>

            <span className='item'>
                <span className='title'>환율: </span>
                <span className='value'>
                    {marketData.usdToKrwExchangeRate !== null ? marketData.usdToKrwExchangeRate : 'Loading...'}
                </span>
            </span>

            <span className='item'>
                <span className="title">시가총액: </span>
                <span className="value">
                    {marketData.totalMarketCapUsd !== null && marketData.usdToKrwExchangeRate !== null ? (marketData.totalMarketCapUsd * marketData.usdToKrwExchangeRate / 1000000000000).toFixed(1) : 'Loading...'}
                </span>
                <span className={`totalMarketRate ${priceDirectionTotalMarket}`}>
                    <img className={`triangleIcon ${priceDirectionTotalMarket}`} src={triangle_icon} alt="Triangle Icon" />
                    {marketData.marketCapChangePercent !== null ? Math.floor(marketData.marketCapChangePercent * 100) / 100 : 'Loading...'}
                </span>
            </span>

            <span className='item'>
                <span className="title">24시간 거래량: </span>
                <span className="value">
                    {marketData.totalVolume24hUsd !== null && marketData.usdToKrwExchangeRate !== null ? (marketData.totalVolume24hUsd * marketData.usdToKrwExchangeRate / 1000000000000).toFixed(2) : 'Loading...'}
                </span>
                <span className={`totalVolueRate ${priceDirectionTotalVolue}`}>
                    <img className={`triangleIcon ${priceDirectionTotalVolue}`} src={triangle_icon} alt="Triangle Icon" />
                    {marketData.volumeChangePercent !== null ? Math.floor(marketData.volumeChangePercent * 100) / 100 : 'Loading...'}
                </span>
            </span>

            <span className='item'>
                <span className="title">도미넌스: </span>
                <span className="value">
                    BTC {marketData.btcDominance !== null ? Math.floor(marketData.btcDominance * 100) / 100 : 'Loading...'}
                </span>
                <span className="value ethDominance">
                    ETH {marketData.ethDominance !== null ? Math.floor(marketData.ethDominance * 100) / 100 : 'Loading...'}
                </span>
            </span> 
        </div>
    );
}

export default TopArea;
