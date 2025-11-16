import { useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Plus, X } from 'lucide-react';

const IndicatorsPanel = ({ onAddIndicator, activeIndicators, onRemoveIndicator }) => {
  const [showMenu, setShowMenu] = useState(false);

  const availableIndicators = [
    { id: 'rsi', name: 'RSI', description: 'Relative Strength Index', category: 'Momentum' },
    { id: 'macd', name: 'MACD', description: 'Moving Average Convergence Divergence', category: 'Momentum' },
    { id: 'bb', name: 'Bollinger Bands', description: 'Volatility Indicator', category: 'Volatility' },
    { id: 'ema20', name: 'EMA 20', description: 'Exponential Moving Average', category: 'Trend' },
    { id: 'ema50', name: 'EMA 50', description: 'Exponential Moving Average', category: 'Trend' },
    { id: 'ema200', name: 'EMA 200', description: 'Exponential Moving Average', category: 'Trend' },
    { id: 'sma20', name: 'SMA 20', description: 'Simple Moving Average', category: 'Trend' },
    { id: 'sma50', name: 'SMA 50', description: 'Simple Moving Average', category: 'Trend' },
    { id: 'stoch', name: 'Stochastic', description: 'Stochastic Oscillator', category: 'Momentum' },
    { id: 'atr', name: 'ATR', description: 'Average True Range', category: 'Volatility' },
  ];

  const categories = [...new Set(availableIndicators.map(i => i.category))];

  return (
    <div className="bg-[#1a1a1a] border-b border-gray-800 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-sm font-semibold text-white">Technical Indicators</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Active Indicators */}
          <div className="flex items-center space-x-1">
            {activeIndicators.map((indicator) => (
              <div
                key={indicator}
                className="flex items-center space-x-1 bg-[#0f0f0f] border border-gray-700 rounded px-2 py-1"
              >
                <span className="text-xs text-gray-300">
                  {availableIndicators.find(i => i.id === indicator)?.name}
                </span>
                <button
                  onClick={() => onRemoveIndicator(indicator)}
                  className="hover:text-red-500 transition"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Indicator Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition"
            >
              <Plus className="w-3 h-3" />
              <span>Add Indicator</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category} className="border-b border-gray-800 last:border-b-0">
                    <div className="px-3 py-2 bg-[#0f0f0f] text-xs font-semibold text-gray-400">
                      {category}
                    </div>
                    {availableIndicators
                      .filter((ind) => ind.category === category)
                      .map((indicator) => (
                        <button
                          key={indicator.id}
                          onClick={() => {
                            onAddIndicator(indicator.id);
                            setShowMenu(false);
                          }}
                          disabled={activeIndicators.includes(indicator.id)}
                          className={`w-full text-left px-3 py-2 hover:bg-[#252525] transition ${
                            activeIndicators.includes(indicator.id)
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                        >
                          <div className="text-sm text-white font-medium">{indicator.name}</div>
                          <div className="text-xs text-gray-400">{indicator.description}</div>
                        </button>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicatorsPanel;
