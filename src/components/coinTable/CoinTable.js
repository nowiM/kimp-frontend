import React from 'react';
import CoinRow from './CoinRow';
import './CoinTable.css';
import triangleIcon from'../images/triangle_icon.svg'

const CoinTable = ({ coinData, exchangeRate, onCoinClick, onSort, sortConfig }) => {
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    return '';
  };

  return (
    <div className="kimpTable">
      <div className="container">
        <table className="table">
          <thead className="tableHeader">
            <tr>
              <th className='simbolInfoTh' onClick={() => onSort('ticker')}>
                코인
                <span className='triangle'>{getSortIndicator('ticker')}</span>
              </th>

              <th className='bybitTh' onClick={() => onSort('bybitPrice')}>
                바이비트($)
                <span className="triangle">{getSortIndicator('bybitPrice')}</span>
              </th>

              <th className='upbitTh' onClick={() => onSort('upbitPrice')}>
                업비트(￦)
                <span className="triangle">{getSortIndicator('upbitPrice')}</span>
              </th>

              <th className='signedChangeRateTh' onClick={() => onSort('signedChangeRate')}>
                등락(%) 
                <span className="triangle">{getSortIndicator('signedChangeRate')}</span>
              </th>

              <th className='lowest52WeekPriceTh' onClick={() => onSort('lowest_52_week_price')}>
                52주 최저
                <span className="triangle">{getSortIndicator('lowest_52_week_price')}</span>
              </th>

              <th className='accTradePriceTh' onClick={() => onSort('acc_trade_price_24h')}>
                거래량(억)
                <span className="triangle">{getSortIndicator('acc_trade_price_24h')}</span>
              </th>

              <th className='premiumTh' onClick={() => onSort('premiumValue')}>
                김치프리미엄(￦)
                <span className="triangle">{getSortIndicator('premiumValue')}</span>
              </th>
            </tr>
          </thead>
          <tbody className="tableBody">
            {coinData.map(({ ticker, ...data }) => (
              <CoinRow 
                key={ticker} 
                ticker={ticker} 
                data={data} 
                exchangeRate={exchangeRate}
                onClick={() => onCoinClick(ticker)} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoinTable;
