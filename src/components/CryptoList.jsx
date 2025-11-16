import { TrendingUp, TrendingDown, Star } from 'lucide-react';

const CryptoList = ({ cryptos, selectedCrypto, onSelectCrypto }) => {
  const formatPrice = (price) => {
    if (price < 1) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 });
    }
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-[#1a1a1a] border-r border-gray-800 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-800 sticky top-0 bg-[#1a1a1a] z-10">
        <h2 className="text-lg font-semibold text-white">Cryptocurrencies</h2>
        <p className="text-sm text-gray-400 mt-1">Real-time market data</p>
      </div>
      
      <div className="divide-y divide-gray-800">
        {cryptos.map((crypto) => (
          <button
            key={crypto.symbol}
            onClick={() => onSelectCrypto(crypto)}
            className={`w-full p-4 hover:bg-[#252525] transition text-left ${
              selectedCrypto?.symbol === crypto.symbol ? 'bg-[#252525] border-l-4 border-green-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  {crypto.symbol.substring(0, 2)}
                </div>
                <div>
                  <div className="font-semibold text-white">{crypto.name}</div>
                  <div className="text-sm text-gray-400">{crypto.symbol}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-[#0f0f0f] rounded transition">
                  <Star className="w-4 h-4 text-gray-500 hover:text-yellow-500" />
                </button>
                <div className="text-right">
                  <div className="font-semibold text-white">
                    ${formatPrice(crypto.price)}
                  </div>
                  <div className={`text-sm flex items-center justify-end ${
                    crypto.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {crypto.change >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CryptoList;
