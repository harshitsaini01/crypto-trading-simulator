import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CryptoList from './components/CryptoList';
import ChartView from './components/ChartView';
import TickerTape from './components/TickerTape';
import TradingPanel from './components/TradingPanel';
import MarketHeatmap from './components/MarketHeatmap';
import DepthChart from './components/DepthChart';
import PortfolioTracker from './components/PortfolioTracker';
import AlertsPanel from './components/AlertsPanel';
import { fetchCryptoPrices, subscribeToWebSocket } from './services/cryptoService';
import { LayoutGrid, TrendingUp, Wallet, Bell } from 'lucide-react';

function App() {
  const [cryptos, setCryptos] = useState([
    {
      symbol: 'BTC/USDT',
      name: 'Bitcoin',
      price: 67845.32,
      change: 2.45,
      volume: 28500000000,
      marketCap: 1330000000000,
    },
    {
      symbol: 'ETH/USDT',
      name: 'Ethereum',
      price: 3421.56,
      change: 3.21,
      volume: 15200000000,
      marketCap: 411000000000,
    },
    {
      symbol: 'BNB/USDT',
      name: 'Binance Coin',
      price: 612.34,
      change: -1.23,
      volume: 1850000000,
      marketCap: 89000000000,
    },
    {
      symbol: 'SOL/USDT',
      name: 'Solana',
      price: 178.92,
      change: 5.67,
      volume: 3200000000,
      marketCap: 78000000000,
    },
    {
      symbol: 'XRP/USDT',
      name: 'Ripple',
      price: 0.6234,
      change: 1.89,
      volume: 1950000000,
      marketCap: 35000000000,
    },
    {
      symbol: 'ADA/USDT',
      name: 'Cardano',
      price: 0.5678,
      change: -0.45,
      volume: 890000000,
      marketCap: 20000000000,
    },
    {
      symbol: 'DOGE/USDT',
      name: 'Dogecoin',
      price: 0.1523,
      change: 4.32,
      volume: 1200000000,
      marketCap: 22000000000,
    },
    {
      symbol: 'MATIC/USDT',
      name: 'Polygon',
      price: 0.8945,
      change: 2.15,
      volume: 650000000,
      marketCap: 8300000000,
    },
    {
      symbol: 'DOT/USDT',
      name: 'Polkadot',
      price: 7.234,
      change: -2.34,
      volume: 420000000,
      marketCap: 9500000000,
    },
    {
      symbol: 'AVAX/USDT',
      name: 'Avalanche',
      price: 36.78,
      change: 3.45,
      volume: 580000000,
      marketCap: 14000000000,
    },
    {
      symbol: 'SHIB/USDT',
      name: 'Shiba Inu',
      price: 0.00002456,
      change: 6.78,
      volume: 890000000,
      marketCap: 14500000000,
    },
    {
      symbol: 'LTC/USDT',
      name: 'Litecoin',
      price: 84.56,
      change: 1.23,
      volume: 520000000,
      marketCap: 6300000000,
    },
  ]);

  const [selectedCrypto, setSelectedCrypto] = useState(cryptos[0]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('trading'); // 'trading', 'analysis', 'portfolio'

  // Fetch initial real prices from Binance
  useEffect(() => {
    const loadInitialPrices = async () => {
      const priceData = await fetchCryptoPrices();
      
      if (priceData) {
        setCryptos((prevCryptos) =>
          prevCryptos.map((crypto) => {
            const realData = priceData[crypto.symbol];
            return realData ? { ...crypto, ...realData } : crypto;
          })
        );
      }
      setLoading(false);
    };

    loadInitialPrices();
  }, []);

  // Subscribe to real-time WebSocket updates
  useEffect(() => {
    const symbols = cryptos.map(c => c.symbol);
    const ws = subscribeToWebSocket(symbols, (symbol, data) => {
      setCryptos((prevCryptos) =>
        prevCryptos.map((crypto) =>
          crypto.symbol === symbol ? { ...crypto, ...data } : crypto
        )
      );
    });

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // Update selected crypto when cryptos change
  useEffect(() => {
    if (selectedCrypto) {
      const updated = cryptos.find((c) => c.symbol === selectedCrypto.symbol);
      if (updated) {
        setSelectedCrypto(updated);
      }
    }
  }, [cryptos, selectedCrypto]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0f0f0f]">
      <Navbar />
      <TickerTape cryptos={cryptos} />
      
      {/* View Mode Tabs */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 px-6">
        <div className="flex space-x-1">
          <button
            onClick={() => setViewMode('trading')}
            className={`flex items-center space-x-2 px-4 py-3 font-medium transition border-b-2 ${
              viewMode === 'trading'
                ? 'text-green-500 border-green-500'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Trading</span>
          </button>
          <button
            onClick={() => setViewMode('analysis')}
            className={`flex items-center space-x-2 px-4 py-3 font-medium transition border-b-2 ${
              viewMode === 'analysis'
                ? 'text-green-500 border-green-500'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Market Analysis</span>
          </button>
          <button
            onClick={() => setViewMode('portfolio')}
            className={`flex items-center space-x-2 px-4 py-3 font-medium transition border-b-2 ${
              viewMode === 'portfolio'
                ? 'text-green-500 border-green-500'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Portfolio</span>
          </button>
        </div>
      </div>

      {/* Trading View */}
      {viewMode === 'trading' && (
        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 flex-shrink-0">
            <CryptoList
              cryptos={cryptos}
              selectedCrypto={selectedCrypto}
              onSelectCrypto={setSelectedCrypto}
            />
          </div>
          <div className="flex-1">
            <ChartView crypto={selectedCrypto} />
          </div>
          <TradingPanel crypto={selectedCrypto} />
        </div>
      )}

      {/* Market Analysis View */}
      {viewMode === 'analysis' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <MarketHeatmap cryptos={cryptos} />
            </div>
            <div>
              <DepthChart crypto={selectedCrypto} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Top Gainers</h3>
              <div className="space-y-2">
                {[...cryptos]
                  .sort((a, b) => b.change - a.change)
                  .slice(0, 5)
                  .map((crypto) => (
                    <div key={crypto.symbol} className="flex items-center justify-between bg-[#0f0f0f] rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                          {crypto.symbol.substring(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{crypto.name}</div>
                          <div className="text-xs text-gray-400">{crypto.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">
                          ${crypto.price < 1 ? crypto.price.toFixed(6) : crypto.price.toFixed(2)}
                        </div>
                        <div className="text-sm font-bold text-green-500">
                          +{crypto.change.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Top Losers</h3>
              <div className="space-y-2">
                {[...cryptos]
                  .sort((a, b) => a.change - b.change)
                  .slice(0, 5)
                  .map((crypto) => (
                    <div key={crypto.symbol} className="flex items-center justify-between bg-[#0f0f0f] rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                          {crypto.symbol.substring(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{crypto.name}</div>
                          <div className="text-xs text-gray-400">{crypto.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">
                          ${crypto.price < 1 ? crypto.price.toFixed(6) : crypto.price.toFixed(2)}
                        </div>
                        <div className="text-sm font-bold text-red-500">
                          {crypto.change.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio View */}
      {viewMode === 'portfolio' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <PortfolioTracker cryptos={cryptos} />
            <AlertsPanel cryptos={cryptos} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
