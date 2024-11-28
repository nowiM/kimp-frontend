import React, { useEffect, useState, useMemo } from 'react';
import io from 'socket.io-client';
import TopArea from './components/topArea/TopArea'; 
import CoinFilterArea from './components/coinFilterArea/CoinFilterArea';
import CoinTable from './components/coinTable/CoinTable';
import ChatApp from './components/chatApp/ChatApp'; 

import updatePremium from './modules/updatePremium';

import './index.css';

function App() {
    const [coinData, setCoinData] = useState({});
    const [exchangeRate, setExchangeRate] = useState(null);
    const [selectedCoin, setSelectedCoin] = useState('BTC');
    const [sortedCoinData, setSortedCoinData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState(() => {
        const savedConfig = localStorage.getItem('sortConfig');
        return savedConfig ? JSON.parse(savedConfig) : { key: 'acc_trade_price_24h', direction: 'desc' };
    });
    const [bookmarks, setBookmarks] = useState({});

    // WebSocket 연결 로직
    useEffect(() => {
        const socket = io(process.env.REACT_APP_BACKEND_URL);

        socket.on('connect', () => {
            console.log('[WebSocket] Connected');
        });

        socket.on('initial', (message) => {
            try {
                setExchangeRate(message.exchangeRate);
                const { upbit, bybit } = message.data;
                const formattedData = {};
    
                for (const ticker in upbit) {
                    const upbitData = upbit[ticker];
                    const bybitData = bybit[ticker] || { price: null };
    
                    formattedData[ticker] = {
                        ticker: ticker,
                        upbitPrice: upbitData.price,
                        bybitPrice: bybitData.price,
                        signedChangeRate: upbitData.signedChangeRate,
                        lowest_52_week_price: upbitData.lowest_52_week_price,
                        acc_trade_price_24h: upbitData.acc_trade_price_24h,
                    };
                }
    
                setCoinData((prevData) => {
                    if (JSON.stringify(prevData) !== JSON.stringify(formattedData)) {
                        return formattedData;
                    }
                    return prevData;
                });
            } catch (error) {
                console.error("Error parsing initial data:", error);
            }
        });

        socket.on('upbit', (message) => {
            const { ticker, price, signedChangeRate, acc_trade_price_24h } = message;
            setCoinData((prevData) => {
                const updatedData = { ...prevData };
    
                if (!updatedData[ticker]) {
                    updatedData[ticker] = { upbitPrice: null, bybitPrice: null, signedChangeRate: null, acc_trade_price_24h: null };
                }
    
                if (
                    updatedData[ticker].upbitPrice !== price ||
                    updatedData[ticker].signedChangeRate !== signedChangeRate ||
                    updatedData[ticker].acc_trade_price_24h !== acc_trade_price_24h
                ) {
                    updatedData[ticker].upbitPrice = price;
                    updatedData[ticker].signedChangeRate = signedChangeRate;
                    updatedData[ticker].acc_trade_price_24h = acc_trade_price_24h;
                    return updatedData;
                }
                return prevData;
            });
        });

        socket.on('bybit', (message) => {
            const { ticker, price } = message;
            setCoinData((prevData) => {
                const updatedData = { ...prevData };
    
                if (!updatedData[ticker]) {
                    updatedData[ticker] = { upbitPrice: null, bybitPrice: null, signedChangeRate: null, acc_trade_price_24h: null };
                }
    
                if (updatedData[ticker].bybitPrice !== price) {
                    updatedData[ticker].bybitPrice = price;
                    return updatedData;
                }
                return prevData;
            });
        });

        socket.on('exchangeRateUpdate', (message) => {
            setExchangeRate((prevRate) => {
                return prevRate !== message.exchangeRate ? message.exchangeRate : prevRate;
            });
        });

        socket.on('disconnect', () => {
            console.warn('[WebSocket] Disconnected. Reconnecting...');
            socket.connect(); // 단순 재연결
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    
    const sortedData = useMemo(() => {
        return Object.keys(coinData)
            .map(ticker => ({
                ticker,
                ...coinData[ticker],
                isBookmarked: bookmarks[ticker] || false,
            }))
            .filter(coin => coin.ticker.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                if (a.isBookmarked && !b.isBookmarked) return -1;
                if (!a.isBookmarked && b.isBookmarked) return 1;

                const { key, direction } = sortConfig;

                if (key === 'premiumValue') {
                    const aPremium = updatePremium(a.ticker, a, exchangeRate).premiumRate;
                    const bPremium = updatePremium(b.ticker, b, exchangeRate).premiumRate;
                    return direction === 'asc' ? aPremium - bPremium : bPremium - aPremium;
                }

                if (a[key] === null) return 1;
                if (b[key] === null) return -1;
                
                return direction === 'asc' ? (a[key] > b[key] ? 1 : -1) : (a[key] < b[key] ? 1 : -1);
            });
    }, [coinData, bookmarks, sortConfig, searchTerm, exchangeRate]);

    const handleBookmarkToggle = (ticker) => {
        setBookmarks((prevBookmarks) => {
            const updatedBookmarks = { ...prevBookmarks, [ticker]: !prevBookmarks[ticker] };
            localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
            return updatedBookmarks;
        });
    };

    useEffect(() => {
        const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
        setBookmarks(savedBookmarks);
    }, []);

    useEffect(() => {
        setSortedCoinData(sortedData);
    }, [sortedData]);

    useEffect(() => {
        localStorage.setItem('sortConfig', JSON.stringify(sortConfig));
    }, [sortConfig]);

    const handleCoinClick = (ticker) => {
        setSelectedCoin(ticker);
    };

    const handleSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <div className='mainContainer'>
            <div className='topArea'>
                <TopArea exchangeRate={exchangeRate} />
            </div>
            <div className='mainContent'>
                <div className='container width1200 width990 width770 widthother'>
                    <div className='coinInfo'>
                        <CoinFilterArea 
                            coin={selectedCoin} 
                            data={coinData[selectedCoin]} 
                            exchangeRate={exchangeRate}
                            onSearch={handleSearch}
                        />
                        <CoinTable 
                            coinData={sortedCoinData} 
                            exchangeRate={exchangeRate} 
                            onCoinClick={handleCoinClick} 
                            onSort={handleSort} 
                            sortConfig={sortConfig}
                            onBookmarkToggle={handleBookmarkToggle} 
                        />
                    </div>
                    <div className='chatApp'>
                        <ChatApp />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
