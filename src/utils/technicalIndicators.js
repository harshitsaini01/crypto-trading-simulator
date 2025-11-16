// Calculate RSI (Relative Strength Index)
export const calculateRSI = (data, period = 14) => {
  if (data.length < period + 1) return [];

  const rsi = [];
  let gains = 0;
  let losses = 0;

  // Calculate initial average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change >= 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  rsi.push({
    time: data[period].time,
    value: 100 - (100 / (1 + avgGain / avgLoss))
  });

  // Calculate RSI for remaining data
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    const gain = change >= 0 ? change : 0;
    const loss = change < 0 ? -change : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rsi.push({
      time: data[i].time,
      value: 100 - (100 / (1 + avgGain / avgLoss))
    });
  }

  return rsi;
};

// Calculate MACD (Moving Average Convergence Divergence)
export const calculateMACD = (data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  const emaFast = calculateEMA(data, fastPeriod);
  const emaSlow = calculateEMA(data, slowPeriod);

  const macdLine = [];
  for (let i = 0; i < emaFast.length; i++) {
    if (emaSlow[i]) {
      macdLine.push({
        time: emaFast[i].time,
        value: emaFast[i].value - emaSlow[i].value
      });
    }
  }

  const signalLine = calculateEMAFromValues(macdLine, signalPeriod);
  const histogram = [];

  for (let i = 0; i < macdLine.length; i++) {
    if (signalLine[i]) {
      histogram.push({
        time: macdLine[i].time,
        value: macdLine[i].value - signalLine[i].value,
        color: macdLine[i].value - signalLine[i].value >= 0 ? '#26a69a' : '#ef5350'
      });
    }
  }

  return { macdLine, signalLine, histogram };
};

// Calculate EMA (Exponential Moving Average)
export const calculateEMA = (data, period) => {
  const k = 2 / (period + 1);
  const ema = [];

  // Start with SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  let emaValue = sum / period;
  ema.push({ time: data[period - 1].time, value: emaValue });

  // Calculate EMA
  for (let i = period; i < data.length; i++) {
    emaValue = data[i].close * k + emaValue * (1 - k);
    ema.push({ time: data[i].time, value: emaValue });
  }

  return ema;
};

// Helper for EMA from values
const calculateEMAFromValues = (data, period) => {
  const k = 2 / (period + 1);
  const ema = [];

  let sum = 0;
  for (let i = 0; i < Math.min(period, data.length); i++) {
    sum += data[i].value;
  }
  let emaValue = sum / Math.min(period, data.length);
  ema.push({ time: data[Math.min(period - 1, data.length - 1)].time, value: emaValue });

  for (let i = period; i < data.length; i++) {
    emaValue = data[i].value * k + emaValue * (1 - k);
    ema.push({ time: data[i].time, value: emaValue });
  }

  return ema;
};

// Calculate SMA (Simple Moving Average)
export const calculateSMA = (data, period) => {
  const sma = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    sma.push({ time: data[i].time, value: sum / period });
  }
  return sma;
};

// Calculate Bollinger Bands
export const calculateBollingerBands = (data, period = 20, stdDev = 2) => {
  const sma = calculateSMA(data, period);
  const upper = [];
  const lower = [];

  for (let i = 0; i < sma.length; i++) {
    const dataIndex = i + period - 1;
    let sum = 0;

    for (let j = 0; j < period; j++) {
      sum += Math.pow(data[dataIndex - j].close - sma[i].value, 2);
    }

    const standardDeviation = Math.sqrt(sum / period);
    upper.push({ time: sma[i].time, value: sma[i].value + stdDev * standardDeviation });
    lower.push({ time: sma[i].time, value: sma[i].value - stdDev * standardDeviation });
  }

  return { upper, middle: sma, lower };
};

// Calculate Stochastic Oscillator
export const calculateStochastic = (data, period = 14, smoothK = 3, smoothD = 3) => {
  const stochastic = [];

  for (let i = period - 1; i < data.length; i++) {
    let highest = data[i].high;
    let lowest = data[i].low;

    for (let j = 0; j < period; j++) {
      if (data[i - j].high > highest) highest = data[i - j].high;
      if (data[i - j].low < lowest) lowest = data[i - j].low;
    }

    const k = ((data[i].close - lowest) / (highest - lowest)) * 100;
    stochastic.push({ time: data[i].time, value: k });
  }

  return stochastic;
};

// Calculate ATR (Average True Range)
export const calculateATR = (data, period = 14) => {
  const tr = [];
  
  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const prevClose = data[i - 1].close;
    
    const trueRange = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    
    tr.push({ time: data[i].time, value: trueRange });
  }

  return calculateSMAFromValues(tr, period);
};

const calculateSMAFromValues = (data, period) => {
  const sma = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].value;
    }
    sma.push({ time: data[i].time, value: sum / period });
  }
  return sma;
};
