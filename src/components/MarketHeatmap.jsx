import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketHeatmap = ({ cryptos }) => {
  const getHeatColor = (change) => {
    if (change >= 5) return 'bg-green-600';
    if (change >= 2) return 'bg-green-500';
    if (change >= 0) return 'bg-green-400';
    if (change >= -2) return 'bg-red-400';
    if (change >= -5) return 'bg-red-500';
    return 'bg-red-600';
  };

  const getTextColor = (change) => {
    return Math.abs(change) >= 2 ? 'text-white' : 'text-gray-900';
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Market Heatmap</h3>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-400">24h Change</span>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-gray-400">-5%</span>
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <span className="text-gray-400">0%</span>
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span className="text-gray-400">+5%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cryptos.map((crypto) => (
          <div
            key={crypto.symbol}
            className={`${getHeatColor(crypto.change)} rounded-lg p-3 transition-all hover:scale-105 cursor-pointer`}
          >
            <div className={`text-xs font-bold ${getTextColor(crypto.change)} mb-1`}>
              {crypto.symbol.split('/')[0]}
            </div>
            <div className={`text-lg font-bold ${getTextColor(crypto.change)}`}>
              {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
            </div>
            <div className={`text-xs ${getTextColor(crypto.change)} opacity-80`}>
              ${crypto.price < 1 
                ? crypto.price.toFixed(6) 
                : crypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketHeatmap;
