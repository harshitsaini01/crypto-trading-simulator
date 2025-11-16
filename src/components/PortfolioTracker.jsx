import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, Trash2, PieChart } from 'lucide-react';

const PortfolioTracker = ({ cryptos }) => {
  const [holdings, setHoldings] = useState([
    { symbol: 'BTC/USDT', amount: 0.5, buyPrice: 65000 },
    { symbol: 'ETH/USDT', amount: 5, buyPrice: 3200 },
    { symbol: 'SOL/USDT', amount: 50, buyPrice: 150 },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newHolding, setNewHolding] = useState({ symbol: '', amount: '', buyPrice: '' });

  const calculatePnL = (holding) => {
    const crypto = cryptos.find(c => c.symbol === holding.symbol);
    if (!crypto) return { pnl: 0, pnlPercent: 0 };

    const currentValue = crypto.price * holding.amount;
    const buyValue = holding.buyPrice * holding.amount;
    const pnl = currentValue - buyValue;
    const pnlPercent = (pnl / buyValue) * 100;

    return { pnl, pnlPercent, currentValue, buyValue };
  };

  const getTotalPortfolioValue = () => {
    return holdings.reduce((total, holding) => {
      const { currentValue } = calculatePnL(holding);
      return total + currentValue;
    }, 0);
  };

  const getTotalPnL = () => {
    return holdings.reduce((total, holding) => {
      const { pnl } = calculatePnL(holding);
      return total + pnl;
    }, 0);
  };

  const addHolding = () => {
    if (newHolding.symbol && newHolding.amount && newHolding.buyPrice) {
      setHoldings([...holdings, {
        symbol: newHolding.symbol,
        amount: parseFloat(newHolding.amount),
        buyPrice: parseFloat(newHolding.buyPrice),
      }]);
      setNewHolding({ symbol: '', amount: '', buyPrice: '' });
      setShowAddForm(false);
    }
  };

  const removeHolding = (index) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  const totalValue = getTotalPortfolioValue();
  const totalPnL = getTotalPnL();
  const totalPnLPercent = (totalPnL / (totalValue - totalPnL)) * 100;

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wallet className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-white">Portfolio</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition"
        >
          <Plus className="w-3 h-3" />
          <span>Add Position</span>
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-[#0f0f0f] rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Total Value</div>
          <div className="text-xl font-bold text-white">
            ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-[#0f0f0f] rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Total P&L</div>
          <div className={`text-xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-[#0f0f0f] rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">P&L %</div>
          <div className={`text-xl font-bold flex items-center ${totalPnLPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalPnLPercent >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Add Position Form */}
      {showAddForm && (
        <div className="bg-[#0f0f0f] rounded-lg p-3 mb-4">
          <div className="grid grid-cols-3 gap-2 mb-2">
            <select
              value={newHolding.symbol}
              onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value })}
              className="bg-[#1a1a1a] border border-gray-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-green-500"
            >
              <option value="">Select Coin</option>
              {cryptos.map((crypto) => (
                <option key={crypto.symbol} value={crypto.symbol}>{crypto.symbol}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={newHolding.amount}
              onChange={(e) => setNewHolding({ ...newHolding, amount: e.target.value })}
              className="bg-[#1a1a1a] border border-gray-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-green-500"
            />
            <input
              type="number"
              placeholder="Buy Price"
              value={newHolding.buyPrice}
              onChange={(e) => setNewHolding({ ...newHolding, buyPrice: e.target.value })}
              className="bg-[#1a1a1a] border border-gray-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-green-500"
            />
          </div>
          <button
            onClick={addHolding}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-1 rounded text-sm font-medium transition"
          >
            Add Position
          </button>
        </div>
      )}

      {/* Holdings List */}
      <div className="space-y-2">
        {holdings.map((holding, index) => {
          const { pnl, pnlPercent, currentValue } = calculatePnL(holding);
          const crypto = cryptos.find(c => c.symbol === holding.symbol);

          return (
            <div key={index} className="bg-[#0f0f0f] rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                    {holding.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{holding.symbol}</div>
                    <div className="text-xs text-gray-400">{holding.amount} coins</div>
                  </div>
                </div>
                <button
                  onClick={() => removeHolding(index)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <div className="text-gray-400">Buy Price</div>
                  <div className="text-white font-medium">${holding.buyPrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Current</div>
                  <div className="text-white font-medium">${crypto?.price.toFixed(2) || '0.00'}</div>
                </div>
                <div>
                  <div className="text-gray-400">Value</div>
                  <div className="text-white font-medium">${currentValue.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-400">P&L</div>
                  <div className={`font-bold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                    <span className="text-xs ml-1">({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(1)}%)</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioTracker;
