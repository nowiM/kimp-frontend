import updatePremium from './updatePremium';

export const filterCoins = (coinData, searchTerm) => {
    return Object.keys(coinData)
        .filter(ticker => ticker.toLowerCase().includes(searchTerm.toLowerCase()))
        .reduce((filtered, ticker) => {
            filtered[ticker] = coinData[ticker];
            return filtered;
        }, {});
}

export const addBookmarkInfo = (filteredData, bookmarks) => {
    return Object.keys(filteredData).map(ticker => ({
        ticker,
        ...filteredData[ticker],
        isBookmarked: bookmarks[ticker] || false,
    }));
}

export const sortCoins = (data, sortConfig, exchangeRate) => {
    return data.sort((a, b) => {
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
}