import React, { useEffect, useState } from 'react';
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
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
  const [sortConfig, setSortConfig] = useState(() => {
    const savedConfig = localStorage.getItem('sortConfig');
    return savedConfig ? JSON.parse(savedConfig) : { key: 'acc_trade_price_24h', direction: 'desc' };
  });
  let conntected = null; //웹소켓 연결 여부를 확인하기 위한 변수

  // Socket.io를 통해 데이터를 받아오는 로직
  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_URL);

    socket.on('connect', () => {
      conntected = true;
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
  
        setCoinData(formattedData); // 초기 데이터는 비교 없이 바로 설정
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

        updatedData[ticker].upbitPrice = price;
        updatedData[ticker].signedChangeRate = signedChangeRate;
        updatedData[ticker].acc_trade_price_24h = acc_trade_price_24h;
  
        return updatedData;
      });
    });

    socket.on('bybit', (message) => {
      const { ticker, price } = message;
  
      setCoinData((prevData) => {
        const updatedData = { ...prevData };

        if (!updatedData[ticker]) {
          updatedData[ticker] = { upbitPrice: null, bybitPrice: null, signedChangeRate: null, acc_trade_price_24h: null };
        }

        updatedData[ticker].bybitPrice = price;
  
        return updatedData;
      });
    });

    socket.on('exchangeRateUpdate', (message) => {
      setExchangeRate(message.exchangeRate);
    });

    socket.on('disconnect', () => {
      conntected = false;
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 코인 데이터를 정렬하는 로직
  useEffect(() => {
    const sortedData = Object.keys(coinData)
      .map(ticker => ({ ticker, ...coinData[ticker] }))
      .filter(coin => coin.ticker.toLowerCase().includes(searchTerm.toLowerCase())) // 검색어로 필터링
      .sort((a, b) => {
        const { key, direction } = sortConfig;

        // 김치 프리미엄 백분율에 대한 정렬을 추가
        if (key === 'premiumValue') {
          const aPremium = updatePremium(a.ticker, a, exchangeRate).premiumRate;
          const bPremium = updatePremium(b.ticker, b, exchangeRate).premiumRate;
          return direction === 'asc' ? aPremium - bPremium : bPremium - aPremium;
        }

        // 다른 필드에 대한 기본 정렬
        if (direction === 'asc') {
          return a[key] > b[key] ? 1 : -1;
        } else {
          return a[key] < b[key] ? 1 : -1;
        }
      });

    setSortedCoinData(sortedData);
  }, [coinData, sortConfig, searchTerm, exchangeRate]);

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
    setSearchTerm(term); // 검색어 상태 업데이트
  };

  return (
    <div className='mainContainer'>
      <div className='topArea'>
        <TopArea />
      </div>
      <div className='mainContent'>
        <div className='container width1200 width990 width770 widthother'>
          <div className='coinInfo'>
            <CoinFilterArea 
              coin={selectedCoin} 
              data={coinData[selectedCoin]} 
              exchangeRate={exchangeRate}
              onSearch={handleSearch} // 검색 기능을 위한 props 전달
            />
            <CoinTable 
              coinData={sortedCoinData} 
              exchangeRate={exchangeRate} 
              onCoinClick={handleCoinClick} 
              onSort={handleSort} 
              sortConfig={sortConfig} 
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
