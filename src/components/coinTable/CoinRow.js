import React from 'react';
import formatUpbitPrice from '../../modules/formatUpbitPrice.js';
import formatBybitPrice from '../../modules/formatBybitPrice.js';
import formatRate from '../../modules/formatRate.js';
import updatePremium from '../../modules/updatePremium.js';

const CoinRow = ({ ticker, data, exchangeRate, onClick }) => {
  const { premiumClass, premiumValue, premiumRate } = updatePremium(ticker, data, exchangeRate);
  const signedChangeClass = data.signedChangeRate > 0 ? "rise" : data.signedChangeRate < 0 ? "fall" : "even";

  return (
    <tr id={`coin-${ticker}`} onClick={onClick} style={{ cursor: 'pointer' }}>
      <td className='simbolInfoTd'>
        <div className="left">
          <img className="coinLogo" src={`https://static.upbit.com/logos/${ticker}.png`} alt={ticker} />
        </div>
        <div className="right">
          {ticker}
        </div>
      </td>

      <td id={`bybit-${ticker}`} className='bybitTd'>
        {formatBybitPrice(data.bybitPrice)}
      </td>

      <td id={`upbit-${ticker}`} className='upbitTd'>
        {formatUpbitPrice(data.upbitPrice)}
      </td>

      <td id={`signed-change-rate_${ticker}`}  className={`signedChangeRateTd ${signedChangeClass}`}>
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
