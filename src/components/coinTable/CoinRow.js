import React, { useEffect, useState } from 'react';
import formatUpbitPrice from '../../modules/formatUpbitPrice.js';
import formatBybitPrice from '../../modules/formatBybitPrice.js';
import formatRate from '../../modules/formatRate.js';
import updatePremium from '../../modules/updatePremium.js';

const CoinRow = ({ ticker, data, exchangeRate, onClick, onBookmarkToggle }) => {
  const { premiumClass, premiumValue, premiumRate } = updatePremium(ticker, data, exchangeRate);
  const signedChangeClass = data.signedChangeRate > 0 ? "rise" : data.signedChangeRate < 0 ? "fall" : "even";

  // 가격 변동 추적을 위한 state
  const [previousBybitPrice, setPreviousBybitPrice] = useState(data.bybitPrice);
  const [previousUpbitPrice, setPreviousUpbitPrice] = useState(data.upbitPrice);

  // 애니메이션 상태 추가
  const [bybitAnimation, setBybitAnimation] = useState('');
  const [upbitAnimation, setUpbitAnimation] = useState('');

  useEffect(() => {
    if (data.bybitPrice !== previousBybitPrice) {
      setBybitAnimation(data.bybitPrice > previousBybitPrice ? 'up' : 'down');
      setPreviousBybitPrice(data.bybitPrice);

      // 애니메이션이 끝난 후 클래스 초기화
      setTimeout(() => setBybitAnimation(''), 1000); // 1초 후 초기화
    }
  }, [data.bybitPrice, previousBybitPrice]);

  useEffect(() => {
    if (data.upbitPrice !== previousUpbitPrice) {
      setUpbitAnimation(data.upbitPrice > previousUpbitPrice ? 'up' : 'down');
      setPreviousUpbitPrice(data.upbitPrice);

      // 애니메이션이 끝난 후 클래스 초기화
      setTimeout(() => setUpbitAnimation(''), 1000); // 1초 후 초기화
    }
  }, [data.upbitPrice, previousUpbitPrice]);
  
  return (
    <tr id={`coin-${ticker}`} onClick={onClick} style={{ cursor: 'pointer' }}>
      <td className='simbolInfoTd'>
        <div className="bookmark" onClick={e => {
            e.stopPropagation();
            onBookmarkToggle(ticker);
        }}>
        </div>
        <div className="left">
          {/* <img className="coinLogo" src={`https://static.upbit.com/logos/${ticker}.png`} alt={ticker} /> */}
          <img
            className="coinLogo"
            src={`${process.env.REACT_APP_BACKEND_URL}optimized-logo/${ticker}`}
            alt={ticker}
          />

        </div>
        <div className="right">
          {ticker}
        </div>
      </td>

      <td id={`bybit-${ticker}`} className='bybitTd'>
          <div className={`fluctuation ${bybitAnimation}`}>
            {formatBybitPrice(data.bybitPrice)}
          </div>
      </td>
      <td id={`upbit-${ticker}`} className='upbitTd'>
            <div className={`fluctuation ${upbitAnimation}`}>
              {formatUpbitPrice(data.upbitPrice)}
            </div>
      </td>

      <td id={`signed-change-rate_${ticker}`} className={`signedChangeRateTd ${signedChangeClass}`}>
        {data.signedChangeRate > 0 ? `+${formatRate(Math.floor(data.signedChangeRate * 10000) / 100)}%` : `${formatRate(Math.floor(data.signedChangeRate * 10000) / 100)}%`}
      </td>

      <td id={`lowest_52_week_price_${ticker}`} className='lowest52WeekPriceTd'>
        {formatUpbitPrice(data.lowest_52_week_price)}
      </td>

      <td id={`acc_trade_price_24h_${ticker}`} className='accTradePriceTd'>
        {Math.floor(data.acc_trade_price_24h / 100000000)}억
      </td>

      <td id={`premium-${ticker}`} className={`premiumTd ${premiumClass}`}>
        {premiumValue !== '' && premiumRate !== '' ? `${formatUpbitPrice(premiumValue)} (${formatRate(premiumRate)}%)` : ''}
      </td>
    </tr>
  );
};

export default CoinRow;
