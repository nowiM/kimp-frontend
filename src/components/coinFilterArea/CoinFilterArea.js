import React, { useState } from 'react';
import formatUpbitPrice from '../../modules/formatUpbitPrice';
import formatRate from '../../modules/formatRate.js';
import updatePremium from '../../modules/updatePremium.js';

import './CoinFilterArea.css'

import upbitLogo from '../images/logo_upbit.svg';
import bybitLogo from '../images/logo_bybit.png';
import twoWayArrow from '../images/twoWayArrow.svg'

const CoinFilterArea = ({ coin, data, exchangeRate, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // 부모 컴포넌트로 검색어 전달
  };

  if (!data) return null;
  const { premiumClass, premiumValue, premiumRate } = updatePremium(coin, data, exchangeRate);
  const signedChangeRateClass = data.signedChangeRate > 0 ? 'rise' : data.signedChangeRate < 0 ? 'fall' : 'even';
  
  return (
    <div className="coinFilterArea">
      <div className="logoAndSearch">
        <div className="logo">
          <div className="upbit" onClick={() => window.open('https://upbit.com/home', '_blank')}>
            <span className="exchange rightMargin">업비트 KRW</span>
            <img className="logoIma" src={upbitLogo} alt="upbit Logo" />
          </div>

          <img className="twoWayArrowIcon" src={twoWayArrow} alt="twoWayArrow Icon" />

          <div className="bybit" onClick={() => window.open('https://www.bybit.com/en', '_blank')}>
            <img className="logoIma bybitBorder" src={bybitLogo} alt="bybit Logo" />
            <span className="exchange leftMargin">바이비트 USDT마켓</span>
          </div>
        </div>
        <div className="search">
          <input 
            name='coinName'
            className="searchFild"
            type="text"
            placeholder="코인 검색(btc, eth)"
            value={searchTerm}
            onChange={handleSearchChange} // 검색어 변경 시 호출
          />
        </div>
      </div>
      <div className="coins">
        <div className="top">
          <div className="logoAndName">
            <img className='logo' src= {`https://static.upbit.com/logos/${coin}.png`} alt="" />
            <span className="name">{coin}</span>
          </div>

          <div className="upbitPrice">
            <span className="title">업비트</span>
            <span className="priceValue">{formatUpbitPrice(data.upbitPrice)}</span> {/* 클래스 이름 추가 */}
          </div>

          <div className="symbol">-</div>

          <div className="bybitPrice">
            <span className="title">바이비트</span>
            <span className="priceValue">{formatUpbitPrice(data.bybitPrice * exchangeRate)}</span> {/* 클래스 이름 추가 */}
          </div>

          <div className="symbol">=</div>

          <div className="kimpPremium">
            <span className="title">김치 프리미엄</span>
            <span className={`valueAndRate ${premiumClass}`}>{formatUpbitPrice(premiumValue)} ({formatRate(premiumRate)}%)</span> {/* 클래스 이름 수정 */}
          </div>
        </div>

        <div className="bottom">
          <div className="signedChangeRate">
            <span className="title block990">등락</span>
            <span className={`changeRateValue ${signedChangeRateClass}`}>{data.signedChangeRate > 0 ? `+${formatRate(Math.floor(data.signedChangeRate * 10000) / 100)}%` : `${formatRate(Math.floor(data.signedChangeRate * 10000) / 100)}%`}</span> {/* 클래스 이름 추가 */}
          </div>

          <div className="lowest52WeekPrice">
            <span className="title block990">52주 최저</span>
            <span className="lowestPriceValue">{formatUpbitPrice(data.lowest_52_week_price)}</span> {/* 클래스 이름 추가 */}
          </div>

          <div className="accTradePrice">
            <span className="title block990">거래대금</span>
            <span className="tradeVolume">{Math.floor(data.acc_trade_price_24h / 100000000)}억</span> {/* 클래스 이름 추가 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinFilterArea;
