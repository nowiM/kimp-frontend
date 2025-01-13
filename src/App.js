import React, { useEffect, useState, useMemo } from 'react';
import TopArea from './components/topArea/TopArea'; 
import CoinFilterArea from './components/coinFilterArea/CoinFilterArea';
import CoinTable from './components/coinTable/CoinTable';
import ChatApp from './components/chatApp/ChatApp'; 

import { createWebsocket } from './utils/createWebsoket';
import { filterCoins, addBookmarkInfo, sortCoins } from './modules/coinHelpers';

import './index.css';

const App = () => {
    const [coinData, setCoinData] = useState({});
    const [exchangeRate, setExchangeRate] = useState(null);
    const [selectedCoin, setSelectedCoin] = useState('BTC');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState(() => {
        const savedConfig = localStorage.getItem('sortConfig');
        return savedConfig ? JSON.parse(savedConfig) : { key: 'acc_trade_price_24h', direction: 'desc' };
    });
    const [bookmarks, setBookmarks] = useState({});

    // WebSocket 연결 및 데이터 관리
    useEffect(() => {
        const socket = createWebsocket(process.env.REACT_APP_BACKEND_URL, { setCoinData, setExchangeRate });
        
        return () => {
            socket.disconnect();
        };
    }, []);

    // localStorage에 저장된 북마크 코인들 상태에 저장
    useEffect(() => {
        const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
        setBookmarks(savedBookmarks);
    }, []);

    // 정렬 기준 변경 시 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('sortConfig', JSON.stringify(sortConfig));
    }, [sortConfig]);
    
    // 검색, 북마크 정보 추가, 정렬을 수행한 최종 코인 데이터를 생성
    const processedCoinData = useMemo(() => {
        const filteredData = filterCoins(coinData, searchTerm);
        const dataWithBookmarks = addBookmarkInfo(filteredData, bookmarks);
        return sortCoins(dataWithBookmarks, sortConfig, exchangeRate);
    }, [coinData, bookmarks, sortConfig, searchTerm, exchangeRate]);

    // 특정 코인의 북마크 상태를 토글하고 로컬 스토리지에 저장
    const handleBookmarkToggle = (ticker) => {
        setBookmarks((prevBookmarks) => {
            const updatedBookmarks = { ...prevBookmarks, [ticker]: !prevBookmarks[ticker] };
            localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
            return updatedBookmarks;
        });
    };

    // 사용자가 특정 코인을 클릭했을 때, 선택된 코인 상태를 업데이트
    const handleCoinClick = (ticker) => {
        setSelectedCoin(ticker);
    };

    // 정렬 기준을 변경하고, 토글에 따라 정렬 순서(오름차순:asc, 내림차순:desc)를 변경
    const handleSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    // 검색어 입력시 검색 상태를 업데이트
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
                            coinData={processedCoinData} 
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