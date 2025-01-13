import io from 'socket.io-client';

export const createWebsocket = (backendUrl, {setCoinData, setExchangeRate}) => {
    const socket = io(backendUrl)

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

    return socket;
}