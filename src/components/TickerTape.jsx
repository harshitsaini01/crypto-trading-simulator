import { TrendingUp, TrendingDown } from 'lucide-react';

const TickerTape = ({ cryptos }) => {
  return (
    <div className="bg-[#0a0a0a] border-b border-gray-800 overflow-hidden">
      <div className="flex animate-scroll">
        {[...cryptos, ...cryptos].map((crypto, index) => (
          <div
            key={`${crypto.symbol}-${index}`}
            className="flex items-center space-x-2 px-6 py-2 whitespace-nowrap"
          >
            <span className="text-gray-400 text-sm font-medium">{crypto.symbol}</span>
            <span className="text-white text-sm font-semibold">
              ${crypto.price.toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: crypto.price < 1 ? 6 : 2 
              })}
            </span>
            <span className={`text-xs flex items-center ${
              crypto.change >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {crypto.change >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-0.5" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-0.5" />
              )}
              {Math.abs(crypto.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerTape;
