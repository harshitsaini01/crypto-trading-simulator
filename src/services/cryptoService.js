import axios from 'axios';

const BINANCE_API = 'https://api.binance.com/api/v3';

// Map our symbols to Binance format
const SYMBOL_MAP = {
  'BTC/USDT': 'BTCUSDT',
  'ETH/USDT': 'ETHUSDT',
  'BNB/USDT': 'BNBUSDT',
  'SOL/USDT': 'SOLUSDT',
  'XRP/USDT': 'XRPUSDT',
  'ADA/USDT': 'ADAUSDT',
  'DOGE/USDT': 'DOGEUSDT',
  'MATIC/USDT': 'MATICUSDT',
  'DOT/USDT': 'DOTUSDT',
  'AVAX/USDT': 'AVAXUSDT',
  'SHIB/USDT': 'SHIBUSDT',
  'LTC/USDT': 'LTCUSDT',
};

export const fetchCryptoPrices = async () => {
  try {
    const symbols = Object.values(SYMBOL_MAP);
    const response = await axios.get(`${BINANCE_API}/ticker/24hr`);
    
    const priceData = {};
    response.data.forEach(ticker => {
      if (symbols.includes(ticker.symbol)) {
        const ourSymbol = Object.keys(SYMBOL_MAP).find(
          key => SYMBOL_MAP[key] === ticker.symbol
        );
        
        if (ourSymbol) {
          priceData[ourSymbol] = {
            price: parseFloat(ticker.lastPrice),
            change: parseFloat(ticker.priceChangePercent),
            volume: parseFloat(ticker.volume) * parseFloat(ticker.lastPrice),
            high: parseFloat(ticker.highPrice),
            low: parseFloat(ticker.lowPrice),
            marketCap: parseFloat(ticker.lastPrice) * parseFloat(ticker.volume) * 100, // Approximate
          };
        }
      }
    });
    
    return priceData;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return null;
  }
};

export const fetchKlineData = async (symbol, interval = '1d', limit = 90) => {
  try {
    const binanceSymbol = SYMBOL_MAP[symbol];
    if (!binanceSymbol) return null;
    
    const response = await axios.get(`${BINANCE_API}/klines`, {
      params: {
        symbol: binanceSymbol,
        interval,
        limit,
      },
    });
    
    return response.data.map(kline => ({
      time: Math.floor(kline[0] / 1000), // Convert to seconds
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
    }));
  } catch (error) {
    console.error('Error fetching kline data:', error);
    return null;
  }
};

export const subscribeToWebSocket = (symbols, callback) => {
  const streams = symbols.map(symbol => {
    const binanceSymbol = SYMBOL_MAP[symbol];
    return `${binanceSymbol.toLowerCase()}@ticker`;
  }).join('/');
  
  const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.data) {
      const ticker = data.data;
      const ourSymbol = Object.keys(SYMBOL_MAP).find(
        key => SYMBOL_MAP[key] === ticker.s
      );
      
      if (ourSymbol) {
        callback(ourSymbol, {
          price: parseFloat(ticker.c),
          change: parseFloat(ticker.P),
          volume: parseFloat(ticker.v) * parseFloat(ticker.c),
          high: parseFloat(ticker.h),
          low: parseFloat(ticker.l),
        });
      }
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return ws;
};
