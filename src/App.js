import React, { useEffect, useState, useMemo } from 'react';
// import io from 'socket.io-client';
import TopArea from './components/topArea/TopArea'; 
import CoinFilterArea from './components/coinFilterArea/CoinFilterArea';
import CoinTable from './components/coinTable/CoinTable';
import ChatApp from './components/chatApp/ChatApp'; 

import createWebsocket from './utils/createWebsoket';
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
        const socket = createWebsocket(process.env.REACT_APP_BACKEND_URL, { setCoinData, setExchangeRate });
        
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