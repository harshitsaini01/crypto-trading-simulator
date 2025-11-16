import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const DepthChart = ({ crypto }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#0f0f0f' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: '#1f2937' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 250,
      rightPriceScale: {
        borderColor: '#374151',
      },
      timeScale: {
        visible: false,
      },
    });

    chartRef.current = chart;

    // Generate mock depth data
    const generateDepthData = () => {
      const bids = [];
      const asks = [];
      const spread = crypto.price * 0.001;
      
      let cumBidVolume = 0;
      let cumAskVolume = 0;

      // Generate bids (buy orders)
      for (let i = 20; i >= 0; i--) {
        const price = crypto.price - (i * spread);
        const volume = Math.random() * 100 + 50;
        cumBidVolume += volume;
        bids.push({ price, volume: cumBidVolume });
      }

      // Generate asks (sell orders)
      for (let i = 1; i <= 20; i++) {
        const price = crypto.price + (i * spread);
        const volume = Math.random() * 100 + 50;
        cumAskVolume += volume;
        asks.push({ price, volume: cumAskVolume });
      }

      return { bids, asks };
    };

    const { bids, asks } = generateDepthData();

    // Create bid series (green)
    const bidSeries = chart.addAreaSeries({
      lineColor: '#10b981',
      topColor: '#10b98140',
      bottomColor: '#10b98100',
      lineWidth: 2,
    });

    // Create ask series (red)
    const askSeries = chart.addAreaSeries({
      lineColor: '#ef4444',
      topColor: '#ef444440',
      bottomColor: '#ef444400',
      lineWidth: 2,
    });

    // Convert to chart format
    const bidData = bids.map((b, i) => ({ time: i, value: b.volume }));
    const askData = asks.map((a, i) => ({ time: i + bids.length, value: a.volume }));

    bidSeries.setData(bidData);
    askSeries.setData(askData);

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
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
  }, [crypto]);

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Depth Chart</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-400">Bids</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-400">Asks</span>
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} />
    </div>
  );
};

export default DepthChart;
