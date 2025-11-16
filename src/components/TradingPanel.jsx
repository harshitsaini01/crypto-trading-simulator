import { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const TradingPanel = ({ crypto }) => {
  const [orderType, setOrderType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState(crypto.price.toFixed(2));

  const handleTrade = () => {
    alert(`${orderType.toUpperCase()} order placed!\nAmount: ${amount} ${crypto.symbol}\nPrice: $${price}`);
  };

  return (
    <div className="bg-[#1a1a1a] border-l border-gray-800 w-80 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Trade {crypto.symbol}</h3>
        
        {/* Order Type Tabs */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setOrderType('buy')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              orderType === 'buy'
                ? 'bg-green-500 text-white'
                : 'bg-[#0f0f0f] text-gray-400 hover:text-white'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4 inline mr-1" />
            Buy
          </button>
          <button
            onClick={() => setOrderType('sell')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              orderType === 'sell'
                ? 'bg-red-500 text-white'
                : 'bg-[#0f0f0f] text-gray-400 hover:text-white'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4 inline mr-1" />
            Sell
          </button>
        </div>

        {/* Price Input */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 mb-1 block">Price (USDT)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
            placeholder="0.00"
          />
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 mb-1 block">Amount ({crypto.symbol.split('/')[0]})</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
            placeholder="0.00"
          />
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {['25%', '50%', '75%', '100%'].map((percent) => (
            <button
              key={percent}
              onClick={() => setAmount((parseFloat(percent) / 100 * 10).toFixed(4))}
              className="bg-[#0f0f0f] text-gray-400 hover:text-white hover:border-green-500 border border-gray-700 rounded py-1 text-xs transition"
            >
              {percent}
            </button>
          ))}
        </div>

        {/* Total */}
        <div className="bg-[#0f0f0f] rounded-lg p-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total</span>
            <span className="text-white font-semibold">
              {(parseFloat(amount || 0) * parseFloat(price || 0)).toFixed(2)} USDT
            </span>
          </div>
        </div>

        {/* Trade Button */}
        <button
          onClick={handleTrade}
          disabled={!amount || !price}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            orderType === 'buy'
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {orderType === 'buy' ? 'Buy' : 'Sell'} {crypto.symbol.split('/')[0]}
        </button>
      </div>

      {/* Order Book Preview */}
      <div className="flex-1 overflow-y-auto p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Order Book</h4>
        
        {/* Asks */}
        <div className="mb-4">
          <div className="text-xs text-gray-400 mb-2">Asks (Sell Orders)</div>
          {[...Array(5)].map((_, i) => {
            const askPrice = crypto.price * (1 + (i + 1) * 0.001);
            const askAmount = Math.random() * 10;
            return (
              <div key={`ask-${i}`} className="flex justify-between text-xs py-1">
                <span className="text-red-400">${askPrice.toFixed(2)}</span>
                <span className="text-gray-400">{askAmount.toFixed(4)}</span>
                <span className="text-gray-500">${(askPrice * askAmount).toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        {/* Current Price */}
        <div className="bg-[#0f0f0f] rounded-lg p-2 mb-4 text-center">
          <div className={`text-lg font-bold ${crypto.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${crypto.price.toFixed(2)}
          </div>
        </div>

        {/* Bids */}
        <div>
          <div className="text-xs text-gray-400 mb-2">Bids (Buy Orders)</div>
          {[...Array(5)].map((_, i) => {
            const bidPrice = crypto.price * (1 - (i + 1) * 0.001);
            const bidAmount = Math.random() * 10;
            return (
              <div key={`bid-${i}`} className="flex justify-between text-xs py-1">
                <span className="text-green-400">${bidPrice.toFixed(2)}</span>
                <span className="text-gray-400">{bidAmount.toFixed(4)}</span>
                <span className="text-gray-500">${(bidPrice * bidAmount).toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;
