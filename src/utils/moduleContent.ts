export interface ModuleContent {
  id: number;
  title: string;
  description: string;
  videoUrl?: string;
  content: string;
  quiz?: {
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
}

interface CourseModules {
  [key: string]: {
    [key: number]: ModuleContent;
  };
}

export const moduleContent: CourseModules = {
  beginners: {
    1: {
      id: 1,
      title: 'Introduction to Trading',
      description: 'Learn the basics of trading and market fundamentals',
      videoUrl: 'https://example.com/intro-to-trading.mp4',
      content: `
# Introduction to Trading

Trading is the act of buying and selling financial instruments with the goal of generating profits. In this module, we'll cover the fundamental concepts that every trader needs to understand.

## What is Trading?
Trading involves participating in financial markets by buying and selling various instruments such as:
- Stocks
- Cryptocurrencies
- Forex (Foreign Exchange)
- Commodities
- Futures and Options

## Key Trading Concepts
1. **Market Basics**
   - Supply and Demand
   - Price Action
   - Volume Analysis
   - Market Structure

2. **Types of Analysis**
   - Technical Analysis
   - Fundamental Analysis
   - Sentiment Analysis

3. **Trading Styles**
   - Day Trading
   - Swing Trading
   - Position Trading
   - Scalping

## Getting Started
Before you start trading, it's essential to understand:
- How markets work
- Basic terminology
- Risk management principles
- Trading psychology

Remember: Successful trading requires patience, discipline, and continuous learning.
      `,
      quiz: {
        questions: [
          {
            question: 'What are the three main types of market analysis?',
            options: [
              'Technical, Fundamental, and Sentiment Analysis',
              'Price, Volume, and Time Analysis',
              'Long, Short, and Medium Analysis',
              'Buy, Sell, and Hold Analysis'
            ],
            correctAnswer: 0
          },
          {
            question: 'Which of these is NOT a common trading style?',
            options: [
              'Day Trading',
              'Swing Trading',
              'Mood Trading',
              'Position Trading'
            ],
            correctAnswer: 2
          }
        ]
      }
    },
    2: {
      id: 2,
      title: 'Market Analysis',
      description: 'Understanding market trends and analysis techniques',
      videoUrl: 'https://example.com/market-analysis.mp4',
      content: `
# Market Analysis Fundamentals

Market analysis is the foundation of successful trading. This module covers essential techniques for analyzing market trends and making informed trading decisions.

## Technical Analysis
### Chart Patterns
- Support and Resistance
- Trend Lines
- Chart Patterns (Head & Shoulders, Double Tops/Bottoms)
- Candlestick Patterns

### Technical Indicators
- Moving Averages
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Volume Indicators

## Market Trends
1. **Trend Types**
   - Uptrend
   - Downtrend
   - Sideways/Consolidation

2. **Trend Analysis**
   - Identifying Trend Direction
   - Trend Strength
   - Trend Reversals
   - Continuation Patterns

## Price Action Trading
- Understanding Price Movement
- Reading Candlestick Charts
- Identifying Key Levels
- Market Structure
      `,
      quiz: {
        questions: [
          {
            question: 'What is a key characteristic of an uptrend?',
            options: [
              'Higher highs and higher lows',
              'Lower highs and lower lows',
              'Equal highs and equal lows',
              'Random highs and lows'
            ],
            correctAnswer: 0
          }
        ]
      }
    },
    3: {
      id: 3,
      title: 'Risk Management',
      description: 'Essential risk management strategies for traders',
      videoUrl: 'https://example.com/risk-management.mp4',
      content: `
# Risk Management in Trading

Risk management is crucial for long-term trading success. This module covers essential strategies to protect your capital and manage trading risks effectively.

## Core Risk Management Principles
1. **Position Sizing**
   - Calculating Position Size
   - Risk per Trade
   - Portfolio Risk Management

2. **Stop Loss Strategies**
   - Fixed Stop Loss
   - Technical Stop Loss
   - Trailing Stops
   - Break-Even Stops

3. **Risk-Reward Ratio**
   - Calculating R:R Ratio
   - Optimal Risk-Reward Ratios
   - Win Rate vs. R:R Balance

## Capital Preservation
- Account Risk Management
- Drawdown Management
- Recovery Strategies
- Risk Allocation

## Common Risk Management Mistakes
- Overleveraging
- Moving Stop Losses
- Revenge Trading
- Overtrading
      `,
      quiz: {
        questions: [
          {
            question: 'What is a good risk-reward ratio for beginners?',
            options: [
              '1:2 or better',
              '1:0.5',
              '3:1',
              '1:0.1'
            ],
            correctAnswer: 0
          }
        ]
      }
    },
    4: {
      id: 4,
      title: 'Trading Psychology',
      description: 'Master the mental aspects of trading',
      videoUrl: 'https://example.com/trading-psychology.mp4',
      content: `
# Trading Psychology

Understanding and mastering trading psychology is essential for consistent success in the markets.

## Emotional Control
1. **Common Trading Emotions**
   - Fear
   - Greed
   - Hope
   - Regret

2. **Managing Emotions**
   - Developing Discipline
   - Building Confidence
   - Maintaining Objectivity
   - Handling Losses

## Trading Mindset
- Developing a Trading Plan
- Following Rules
- Maintaining Focus
- Building Consistency

## Common Psychological Pitfalls
- FOMO (Fear of Missing Out)
- Revenge Trading
- Overconfidence
- Analysis Paralysis

## Building Mental Resilience
- Dealing with Losses
- Learning from Mistakes
- Maintaining Work-Life Balance
- Continuous Improvement
      `,
      quiz: {
        questions: [
          {
            question: 'What is FOMO in trading?',
            options: [
              'Fear of Missing Out',
              'Focus on Market Orders',
              'Forward Market Operations',
              'Fixed Money Optimization'
            ],
            correctAnswer: 0
          }
        ]
      }
    },
    5: {
      id: 5,
      title: 'Technical Analysis',
      description: 'Learn to read and interpret charts',
      videoUrl: 'https://example.com/technical-analysis.mp4',
      content: `
# Technical Analysis Deep Dive

Technical analysis is the study of price action and chart patterns to predict future market movements.

## Advanced Chart Analysis
1. **Complex Chart Patterns**
   - Fibonacci Retracements
   - Elliott Wave Theory
   - Harmonic Patterns
   - Market Structure

2. **Advanced Indicators**
   - Bollinger Bands
   - Ichimoku Cloud
   - Volume Profile
   - Market Profile

## Multiple Timeframe Analysis
- Timeframe Correlation
- Top-Down Analysis
- Bottom-Up Analysis
- Timeframe Confluence

## Advanced Concepts
- Market Cycles
- Wyckoff Method
- Order Flow Analysis
- Price Action Patterns
      `,
      quiz: {
        questions: [
          {
            question: 'What is the Wyckoff Method primarily used for?',
            options: [
              'Understanding market manipulation and institutional trading',
              'Predicting weather patterns',
              'Calculating position sizes',
              'Managing stop losses'
            ],
            correctAnswer: 0
          }
        ]
      }
    },
    6: {
      id: 6,
      title: 'Trading Tools',
      description: 'Essential tools and platforms for trading',
      videoUrl: 'https://example.com/trading-tools.mp4',
      content: `
# Trading Tools and Platforms

Understanding and effectively using trading tools is crucial for successful trading.

## Essential Trading Tools
1. **Charting Platforms**
   - TradingView
   - MetaTrader
   - ThinkOrSwim
   - Custom Indicators

2. **Order Types**
   - Market Orders
   - Limit Orders
   - Stop Orders
   - OCO Orders

## Trading Platform Features
- Order Entry
- Position Management
- Risk Management Tools
- Analytics and Reporting

## Additional Tools
- Economic Calendars
- News Feeds
- Market Scanners
- Portfolio Trackers

## Best Practices
- Platform Setup
- Workspace Organization
- Backup Systems
- Tool Integration
      `,
      quiz: {
        questions: [
          {
            question: 'What is an OCO order?',
            options: [
              'One Cancels Other - two orders where if one executes, the other is cancelled',
              'Open Close Only - orders that only work during market opens and closes',
              'Order Cancellation Option - an option to cancel any order',
              'Over Collateral Order - an order requiring extra margin'
            ],
            correctAnswer: 0
          }
        ]
      }
    }
  },
  intermediate: {
    1: {
      id: 1,
      title: 'Advanced Chart Patterns',
      description: 'Master complex chart patterns and formations',
      videoUrl: 'https://example.com/advanced-patterns.mp4',
      content: `
# Advanced Chart Patterns

Learn to identify and trade complex chart patterns with high probability setups.

## Advanced Pattern Recognition
1. **Complex Harmonic Patterns**
   - Gartley Pattern
   - Butterfly Pattern
   - Bat Pattern
   - Crab Pattern

2. **Advanced Price Action Patterns**
   - Three Drive Pattern
   - 1-2-3 Pattern
   - Wolfe Waves
   - Wyckoff Method

## Pattern Trading Strategies
- Entry and Exit Points
- Stop Loss Placement
- Target Setting
- Risk Management

## Volume Analysis
- Volume Profile
- Market Profile
- Order Flow
- Footprint Charts
      `,
      quiz: {
        questions: [
          {
            question: 'Which pattern is known for its precise Fibonacci measurements?',
            options: [
              'Gartley Pattern',
              'Double Top',
              'Head and Shoulders',
              'Triangle Pattern'
            ],
            correctAnswer: 0
          },
          {
            question: 'What is the main principle of the Wyckoff Method?',
            options: [
              'Following moving averages',
              'Understanding institutional trading behavior',
              'Using momentum indicators',
              'Trading breakouts only'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    2: {
      id: 2,
      title: 'Advanced Technical Indicators',
      description: 'Learn to use and combine complex technical indicators',
      videoUrl: 'https://example.com/advanced-indicators.mp4',
      content: `
# Advanced Technical Indicators

Master complex technical indicators and learn how to combine them effectively.

## Advanced Indicators
1. **Momentum Indicators**
   - Stochastic RSI
   - Williams %R
   - CCI (Commodity Channel Index)
   - ADX (Average Directional Index)

2. **Volume-Based Indicators**
   - OBV (On Balance Volume)
   - Money Flow Index
   - Volume Profile
   - VWAP

3. **Market Structure Indicators**
   - Ichimoku Cloud
   - Pivot Points
   - Market Profile
   - Volume Profile Fixed Range

## Indicator Combinations
- Creating Custom Indicator Setups
- Multi-Timeframe Analysis
- Divergence Trading
- Confluence Trading
      `,
      quiz: {
        questions: [
          {
            question: 'What does the Ichimoku Cloud primarily indicate?',
            options: [
              'Only volume analysis',
              'Only price momentum',
              'Support, resistance, momentum, and trend direction',
              'Only market volatility'
            ],
            correctAnswer: 2
          }
        ]
      }
    },
    3: {
      id: 3,
      title: 'Market Microstructure',
      description: 'Understanding market mechanics and order flow',
      videoUrl: 'https://example.com/market-microstructure.mp4',
      content: `
# Market Microstructure

Understand how markets work at the micro level and how to use this knowledge in trading.

## Order Flow Analysis
1. **Order Types**
   - Market Orders
   - Limit Orders
   - Stop Orders
   - Conditional Orders

2. **Market Depth**
   - Level 2 Data
   - Time and Sales
   - Order Book Analysis
   - Tape Reading

## Liquidity Analysis
- Identifying Liquidity Pools
- Understanding Market Maker Behavior
- Order Flow Patterns
- Volume Profile Analysis

## Trading Applications
- Order Flow Trading Strategies
- Reading the Tape
- Using Level 2 Data
- Market Making Concepts
      `,
      quiz: {
        questions: [
          {
            question: 'What is the main purpose of Level 2 data?',
            options: [
              'To calculate moving averages',
              'To view historical prices',
              'To analyze sentiment',
              'To see the order book depth and pending orders'
            ],
            correctAnswer: 3
          }
        ]
      }
    }
  },
  advanced: {
    1: {
      id: 1,
      title: 'Algorithmic Trading',
      description: 'Introduction to algorithmic trading and automation',
      videoUrl: 'https://example.com/algo-trading.mp4',
      content: `
# Algorithmic Trading

Learn the fundamentals of algorithmic trading and how to develop automated trading systems.

## Algorithmic Trading Basics
1. **Types of Algorithms**
   - Trend Following
   - Mean Reversion
   - Statistical Arbitrage
   - Market Making

2. **Strategy Development**
   - Backtesting
   - Forward Testing
   - Walk-Forward Analysis
   - Monte Carlo Simulation

## Risk Management
- Position Sizing
- Portfolio Management
- Risk Metrics
- Drawdown Control

## Implementation
- API Integration
- Order Management
- Risk Controls
- Performance Monitoring
      `,
      quiz: {
        questions: [
          {
            question: 'What is the primary purpose of backtesting?',
            options: [
              'To predict future market movements',
              'To validate trading strategies using historical data',
              'To analyze current market conditions',
              'To place automated trades'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    2: {
      id: 2,
      title: 'Quantitative Analysis',
      description: 'Advanced mathematical and statistical methods in trading',
      videoUrl: 'https://example.com/quant-analysis.mp4',
      content: `
# Quantitative Analysis

Master the mathematical and statistical methods used in modern trading.

## Statistical Methods
1. **Probability Theory**
   - Probability Distributions
   - Expected Value
   - Standard Deviation
   - Correlation Analysis

2. **Time Series Analysis**
   - Moving Averages
   - Auto-correlation
   - Mean Reversion
   - Trend Analysis

## Mathematical Models
- Black-Scholes Model
- Monte Carlo Simulation
- Kelly Criterion
- Risk-Adjusted Returns

## Applications
- Portfolio Optimization
- Risk Management
- Strategy Development
- Performance Analysis
      `,
      quiz: {
        questions: [
          {
            question: 'What is the Kelly Criterion used for?',
            options: [
              'Calculating option prices',
              'Analyzing market trends',
              'Optimal position sizing based on probability and odds',
              'Measuring volatility'
            ],
            correctAnswer: 2
          }
        ]
      }
    },
    3: {
      id: 3,
      title: 'High-Frequency Trading',
      description: 'Understanding HFT strategies and infrastructure',
      videoUrl: 'https://example.com/hft.mp4',
      content: `
# High-Frequency Trading

Learn about high-frequency trading strategies and the infrastructure required.

## HFT Fundamentals
1. **Infrastructure**
   - Low Latency Networks
   - Co-location
   - Hardware Requirements
   - Market Data Feeds

2. **Strategies**
   - Market Making
   - Statistical Arbitrage
   - News-Based Trading
   - Technical Trading

## Implementation
- Order Types
- Smart Order Routing
- Risk Management
- Compliance Requirements

## Market Impact
- Liquidity Provision
- Price Discovery
- Market Efficiency
- Regulatory Considerations
      `,
      quiz: {
        questions: [
          {
            question: 'What is co-location in HFT?',
            options: [
              'Working with multiple brokers',
              'Using multiple trading strategies',
              'Analyzing multiple markets',
              'Placing servers near exchange matching engines'
            ],
            correctAnswer: 3
          }
        ]
      }
    }
  }
}; 