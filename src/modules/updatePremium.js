const updatePremium = (ticker, data, exchangeRate) => {
    let premiumValue = '';
    let premiumRate = '';
    let premiumClass = '';

    if (data.upbitPrice !== null && data.bybitPrice !== null && exchangeRate !== null) {
        if (ticker === 'SHIB') {
            premiumValue = data.upbitPrice - data.bybitPrice; // 김프 금액
            premiumRate = data.upbitPrice / data.bybitPrice; // 김프율
        } else {
            premiumValue = data.upbitPrice - (data.bybitPrice * exchangeRate);
            premiumRate = (data.upbitPrice / (data.bybitPrice * exchangeRate)) * 100 - 100; // 김프율
        }
    }

    premiumClass = premiumRate > 0 && data.bybitPrice ? "kimp" : premiumRate < 0 && data.bybitPrice ? "reverse" : 'even';

    return {premiumClass, premiumValue, premiumRate};
}

export default updatePremium;