import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { fetchKlineData } from '../services/cryptoService';
import IndicatorsPanel from './IndicatorsPanel';
import { 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands, 
  calculateEMA, 
  calculateSMA 
} from '../utils/technicalIndicators';

const ChartView = ({ crypto }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const indicatorSeriesRef = useRef({});
  const [timeframe, setTimeframe] = useState('1D');
  const [activeIndicators, setActiveIndicators] = useState(['ema20']);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#0f0f0f' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#374151',
      },
      rightPriceScale: {
        borderColor: '#374151',
      },
    });
    
    chartRef.current = chart;

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // Create volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    chart.priceScale('').applyOptions({
      scaleMargins: {
        top: 0.7,
        bottom: 0,
      },
    });

    // Fetch real data from Binance API
    const loadChartData = async () => {
      const intervalMap = {
        '1H': '1h',
        '4H': '4h',
        '1D': '1d',
        '1W': '1w',
        '1M': '1M',
      };

      const klineData = await fetchKlineData(crypto.symbol, intervalMap[timeframe], 90);
      
      if (klineData && klineData.length > 0) {
        const candleData = klineData.map(k => ({
          time: k.time,
          open: k.open,
          high: k.high,
          low: k.low,
          close: k.close,
        }));

        const volumeData = klineData.map(k => ({
          time: k.time,
          value: k.volume,
          color: k.close >= k.open ? '#10b98180' : '#ef444480',
        }));

        candlestickSeries.setData(candleData);
        volumeSeries.setData(volumeData);

        // Add technical indicators
        activeIndicators.forEach((indicator) => {
          if (indicatorSeriesRef.current[indicator]) {
            chart.removeSeries(indicatorSeriesRef.current[indicator]);
          }

          if (indicator === 'rsi') {
            const rsiData = calculateRSI(klineData);
            const rsiSeries = chart.addLineSeries({
              color: '#9c27b0',
              lineWidth: 2,
              priceScaleId: 'rsi',
            });
            chart.priceScale('rsi').applyOptions({
              scaleMargins: { top: 0.8, bottom: 0 },
            });
            rsiSeries.setData(rsiData);
            indicatorSeriesRef.current[indicator] = rsiSeries;
          } else if (indicator === 'macd') {
            const { macdLine, signalLine, histogram } = calculateMACD(klineData);
            const macdSeries = chart.addLineSeries({
              color: '#2196f3',
              lineWidth: 2,
              priceScaleId: 'macd',
            });
            const signalSeries = chart.addLineSeries({
              color: '#ff9800',
              lineWidth: 2,
              priceScaleId: 'macd',
            });
            const histogramSeries = chart.addHistogramSeries({
              priceScaleId: 'macd',
            });
            chart.priceScale('macd').applyOptions({
              scaleMargins: { top: 0.8, bottom: 0 },
            });
            macdSeries.setData(macdLine);
            signalSeries.setData(signalLine);
            histogramSeries.setData(histogram);
            indicatorSeriesRef.current[indicator] = macdSeries;
          } else if (indicator === 'bb') {
            const { upper, middle, lower } = calculateBollingerBands(klineData);
            const upperSeries = chart.addLineSeries({
              color: '#9c27b0',
              lineWidth: 1,
            });
            const middleSeries = chart.addLineSeries({
              color: '#9c27b0',
              lineWidth: 2,
            });
            const lowerSeries = chart.addLineSeries({
              color: '#9c27b0',
              lineWidth: 1,
            });
            upperSeries.setData(upper);
            middleSeries.setData(middle);
            lowerSeries.setData(lower);
            indicatorSeriesRef.current[indicator] = middleSeries;
          } else if (indicator.startsWith('ema')) {
            const period = parseInt(indicator.replace('ema', ''));
            const emaData = calculateEMA(klineData, period);
            const colors = { 20: '#2196f3', 50: '#ff9800', 200: '#9c27b0' };
            const emaSeries = chart.addLineSeries({
              color: colors[period] || '#2196f3',
              lineWidth: 2,
            });
            emaSeries.setData(emaData);
            indicatorSeriesRef.current[indicator] = emaSeries;
          } else if (indicator.startsWith('sma')) {
            const period = parseInt(indicator.replace('sma', ''));
            const smaData = calculateSMA(klineData, period);
            const colors = { 20: '#4caf50', 50: '#ffc107', 200: '#f44336' };
            const smaSeries = chart.addLineSeries({
              color: colors[period] || '#4caf50',
              lineWidth: 2,
              lineStyle: 2, // Dashed
            });
            smaSeries.setData(smaData);
            indicatorSeriesRef.current[indicator] = smaSeries;
          }
        });
      }
    };

    loadChartData();

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [crypto, timeframe, activeIndicators]);

  const handleAddIndicator = (indicator) => {
    if (!activeIndicators.includes(indicator)) {
      setActiveIndicators([...activeIndicators, indicator]);
    }
  };

  const handleRemoveIndicator = (indicator) => {
    setActiveIndicators(activeIndicators.filter(i => i !== indicator));
  };

  const timeframes = ['1H', '4H', '1D', '1W', '1M'];

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f]">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
              {crypto.symbol.substring(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{crypto.name}</h1>
              <p className="text-sm text-gray-400">{crypto.symbol}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-lg flex items-center justify-end ${
              crypto.change >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {crypto.change >= 0 ? (
                <TrendingUp className="w-5 h-5 mr-1" />
              ) : (
                <TrendingDown className="w-5 h-5 mr-1" />
              )}
              {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-[#0f0f0f] rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">24h High</div>
            <div className="text-lg font-semibold text-white">
              ${(crypto.price * 1.05).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="bg-[#0f0f0f] rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">24h Low</div>
            <div className="text-lg font-semibold text-white">
              ${(crypto.price * 0.95).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="bg-[#0f0f0f] rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">24h Volume</div>
            <div className="text-lg font-semibold text-white">
              ${(crypto.volume / 1000000).toFixed(2)}M
            </div>
          </div>
          <div className="bg-[#0f0f0f] rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Market Cap</div>
            <div className="text-lg font-semibold text-white">
              ${(crypto.marketCap / 1000000000).toFixed(2)}B
            </div>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center space-x-2 mt-4">
          <Activity className="w-4 h-4 text-gray-400" />
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                timeframe === tf
                  ? 'bg-green-500 text-white'
                  : 'bg-[#0f0f0f] text-gray-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Indicators Panel */}
      <IndicatorsPanel
        onAddIndicator={handleAddIndicator}
        activeIndicators={activeIndicators}
        onRemoveIndicator={handleRemoveIndicator}
      />

      {/* Chart */}
      <div ref={chartContainerRef} className="flex-1" />
    </div>
  );
};

export default ChartView;
