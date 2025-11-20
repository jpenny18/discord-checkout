import { TradingStrategy } from '@/types/trading-journal';

export const tradingStrategies: TradingStrategy[] = [
  {
    id: 'breakout',
    name: 'Breakout Strategy',
    description: 'Trading breakouts of key support/resistance levels',
    confluenceChecklist: [
      { id: 'volume', label: 'Volume Confirmation', description: 'Higher than average volume on breakout', required: true },
      { id: 'trend', label: 'Trend Alignment', description: 'Breakout aligns with higher timeframe trend', required: true },
      { id: 'level', label: 'Clean Level', description: 'Clear support/resistance level with multiple touches', required: true },
      { id: 'consolidation', label: 'Consolidation Period', description: 'Sufficient consolidation before breakout', required: false },
      { id: 'retest', label: 'Retest Setup', description: 'Waiting for retest of broken level', required: false },
      { id: 'momentum', label: 'Momentum Indicators', description: 'RSI, MACD showing momentum', required: false },
    ],
  },
  {
    id: 'reversal',
    name: 'Reversal Strategy',
    description: 'Trading reversals at key levels with confirmation',
    confluenceChecklist: [
      { id: 'level', label: 'Key S/R Level', description: 'Trading at major support/resistance', required: true },
      { id: 'pattern', label: 'Reversal Pattern', description: 'Candlestick reversal pattern present', required: true },
      { id: 'divergence', label: 'Divergence', description: 'RSI or MACD divergence present', required: false },
      { id: 'oversold', label: 'Oversold/Overbought', description: 'Indicator showing extreme conditions', required: false },
      { id: 'volume', label: 'Volume Analysis', description: 'Volume supporting reversal', required: false },
      { id: 'fibonacci', label: 'Fibonacci Level', description: 'At key Fibonacci retracement level', required: false },
    ],
  },
  {
    id: 'trend-following',
    name: 'Trend Following',
    description: 'Following established trends with pullback entries',
    confluenceChecklist: [
      { id: 'trend', label: 'Clear Trend', description: 'Higher highs and higher lows (or vice versa)', required: true },
      { id: 'pullback', label: 'Healthy Pullback', description: 'Pullback to key moving average or level', required: true },
      { id: 'ma', label: 'Moving Average Alignment', description: 'MAs in correct order (20, 50, 200)', required: true },
      { id: 'structure', label: 'Market Structure', description: 'No break of structure', required: true },
      { id: 'momentum', label: 'Momentum', description: 'Momentum indicators aligned with trend', required: false },
      { id: 'volume', label: 'Volume Profile', description: 'Volume supporting trend continuation', required: false },
    ],
  },
  {
    id: 'scalping',
    name: 'Scalping Strategy',
    description: 'Quick trades capturing small moves in high liquidity',
    confluenceChecklist: [
      { id: 'liquidity', label: 'High Liquidity', description: 'Trading during high volume sessions', required: true },
      { id: 'spread', label: 'Tight Spread', description: 'Minimal bid-ask spread', required: true },
      { id: 'level', label: 'Intraday Level', description: 'Clear intraday support/resistance', required: true },
      { id: 'momentum', label: 'Quick Momentum', description: 'Fast momentum on lower timeframes', required: true },
      { id: 'orderflow', label: 'Order Flow', description: 'Order flow showing clear direction', required: false },
      { id: 'vwap', label: 'VWAP Position', description: 'Price position relative to VWAP', required: false },
    ],
  },
  {
    id: 'supply-demand',
    name: 'Supply & Demand Zones',
    description: 'Trading from institutional supply and demand zones',
    confluenceChecklist: [
      { id: 'zone', label: 'Fresh Zone', description: 'Untouched or lightly tested zone', required: true },
      { id: 'reaction', label: 'Strong Previous Reaction', description: 'Zone created by strong move away', required: true },
      { id: 'timeframe', label: 'HTF Alignment', description: 'Higher timeframe zone confirmation', required: true },
      { id: 'distance', label: 'Price Distance', description: 'Price has moved away sufficiently', required: false },
      { id: 'confluence', label: 'Additional Confluence', description: 'Fib level, trend line, or pattern', required: false },
      { id: 'rr', label: 'Risk:Reward', description: 'Minimum 1:2 risk to reward', required: true },
    ],
  },
  {
    id: 'smart-money',
    name: 'Smart Money Concepts (SMC)',
    description: 'Trading based on institutional order flow and market structure',
    confluenceChecklist: [
      { id: 'structure', label: 'Break of Structure', description: 'CHoCH or BOS identified', required: true },
      { id: 'orderblock', label: 'Order Block', description: 'Trading from valid order block', required: true },
      { id: 'liquidity', label: 'Liquidity Sweep', description: 'Stop hunt / liquidity grab occurred', required: true },
      { id: 'fvg', label: 'Fair Value Gap', description: 'FVG present for entry refinement', required: false },
      { id: 'displacement', label: 'Displacement', description: 'Strong momentum candle showing displacement', required: false },
      { id: 'inducement', label: 'Inducement', description: 'Liquidity inducement identified', required: false },
    ],
  },
  {
    id: 'price-action',
    name: 'Pure Price Action',
    description: 'Trading based on clean price action patterns',
    confluenceChecklist: [
      { id: 'pattern', label: 'PA Pattern', description: 'Pin bar, engulfing, inside bar, etc.', required: true },
      { id: 'level', label: 'At Key Level', description: 'Pattern formed at S/R level', required: true },
      { id: 'context', label: 'Market Context', description: 'Pattern in context of larger trend', required: true },
      { id: 'rejection', label: 'Rejection Wick', description: 'Clear rejection of level', required: false },
      { id: 'confirmation', label: 'Confirmation Candle', description: 'Next candle confirms direction', required: false },
      { id: 'clean', label: 'Clean Charts', description: 'No clutter, clear price action', required: true },
    ],
  },
  {
    id: 'custom',
    name: 'Custom Strategy',
    description: 'Define your own strategy and checklist',
    confluenceChecklist: [
      { id: 'custom1', label: 'Confluence 1', description: 'Add your first confluence factor', required: true },
      { id: 'custom2', label: 'Confluence 2', description: 'Add your second confluence factor', required: false },
      { id: 'custom3', label: 'Confluence 3', description: 'Add your third confluence factor', required: false },
      { id: 'custom4', label: 'Confluence 4', description: 'Add your fourth confluence factor', required: false },
      { id: 'custom5', label: 'Confluence 5', description: 'Add your fifth confluence factor', required: false },
    ],
  },
];

