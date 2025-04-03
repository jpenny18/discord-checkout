'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import dynamicImport from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import Link from 'next/link';
import { LockClosedIcon } from '@heroicons/react/24/solid';

// Dynamically import with SSR disabled and loading component
const ApexChartComponent = dynamicImport(
  () => import('react-apexcharts').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => <div className="h-[350px] w-full bg-gray-900 animate-pulse rounded-lg"></div>
  }
);

// This added export configuration ensures Next.js doesn't try to pre-render this page
export const dynamic = "force-dynamic";

// Type definitions to fix linter errors
interface ChartDataPoint {
  x: Date;
  y: number;
}

interface ChartData {
  series: {
    name: string;
    data: ChartDataPoint[];
  }[];
  options: ApexOptions;
}

// Mock data for UI display
const mockAccounts = [
  {
    id: '1',
    challenge_type: 'Gauntlet',
    account_balance: 50000,
    status: 'in_progress' as const
  },
  {
    id: '2',
    challenge_type: 'Standard',
    account_balance: 100000,
    status: 'in_progress' as const
  }
];

const mockMetrics = {
  balance: 50000,
  equity: 51200,
  trades: 12,
  lots: 6.2,
  winRate: 68.5,
  avgProfit: 450.25,
  avgLoss: 210.75,
  avgRRR: 2.1,
  expectancy: 150.42,
  profitFactor: 2.25
};

const mockTradingJournal = [
  { 
    ticket: '12345',
    type: 'buy' as const,
    symbol: 'EURUSD',
    volume: 0.5,
    profit: 325.50,
    duration: '4h 32m'
  },
  { 
    ticket: '12346',
    type: 'sell' as const,
    symbol: 'GBPUSD',
    volume: 0.8,
    profit: -187.25,
    duration: '2h 15m'
  },
  { 
    ticket: '12347',
    type: 'buy' as const,
    symbol: 'USDJPY',
    volume: 1.2,
    profit: 540.80,
    duration: '6h 20m'
  },
  { 
    ticket: '12348',
    type: 'sell' as const,
    symbol: 'AUDUSD',
    volume: 0.4,
    profit: 125.30,
    duration: '3h 45m'
  },
  { 
    ticket: '12349',
    type: 'buy' as const,
    symbol: 'USDCAD',
    volume: 0.6,
    profit: -210.40,
    duration: '5h 10m'
  }
];

// Generate some mock chart data
const generateMockChartData = (): ChartDataPoint[] => {
  const today = new Date();
  const data: ChartDataPoint[] = [];
  let balance = 50000;
  
  // Generate data for the past 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Random daily change between -1% and +2%
    const changePercent = (Math.random() * 3) - 1;
    balance += balance * (changePercent / 100);
    
    data.push({
      x: date,
      y: parseFloat(balance.toFixed(2))
    });
  }
  
  return data;
};

export default function MyAccountsPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(mockAccounts[0]);
  const [chartData, setChartData] = useState<ChartData>({
    series: [{
      name: 'Equity',
      data: []
    }],
    options: {
      chart: {
        type: 'line' as const,
        height: 350,
        background: '#000000',
        foreColor: '#ffffff',
        toolbar: {
          show: false
        },
        animations: {
          enabled: true
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: '#ffffff'
          }
        },
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        labels: {
          formatter: (value: number) => `$${value.toFixed(2)}`,
          style: {
            colors: '#ffffff'
          }
        }
      },
      grid: {
        borderColor: '#333333',
        strokeDashArray: 5,
        position: 'back'
      },
      theme: {
        mode: 'dark'
      },
      annotations: {
        yaxis: [
          {
            y: selectedAccount.account_balance * 1.1, // 10% profit target
            borderColor: '#00ff00',
            label: {
              text: 'Profit Target',
              style: {
                color: '#ffffff'
              }
            }
          },
          {
            y: selectedAccount.account_balance * 0.95, // 5% max loss
            borderColor: '#ff0000',
            label: {
              text: 'Max Loss',
              style: {
                color: '#ffffff'
              }
            }
          }
        ]
      },
      tooltip: {
        theme: 'dark',
        x: {
          format: 'dd MMM yyyy HH:mm'
        }
      }
    }
  });

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true);
    
    // Set chart data with mock data
    setChartData(prev => ({
      ...prev,
      series: [{
        name: 'Equity',
        data: generateMockChartData()
      }]
    }));
  }, []);

  // Handle account change
  const handleAccountChange = (accountId: string) => {
    const account = mockAccounts.find(a => a.id === accountId);
    if (account) {
      setSelectedAccount(account);
      
      // Update chart annotations based on new account
      setChartData(prev => ({
        ...prev,
        options: {
          ...prev.options,
          annotations: {
            yaxis: [
              {
                y: account.account_balance * 1.1, // 10% profit target
                borderColor: '#00ff00',
                label: {
                  text: 'Profit Target',
                  style: {
                    color: '#ffffff'
                  }
                }
              },
              {
                y: account.account_balance * 0.95, // 5% max loss
                borderColor: '#ff0000',
                label: {
                  text: 'Max Loss',
                  style: {
                    color: '#ffffff'
                  }
                }
              }
            ]
          }
        }
      }));
    }
  };

  // Return a loading state during server-side rendering
  if (!isClient) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold text-white mb-4">My Trading Accounts</h1>
        <div className="grid grid-cols-2 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 relative">
      {/* Content */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">My Trading Accounts</h1>
        <Tabs 
          value={selectedAccount.id}
          onValueChange={handleAccountChange}
        >
          <TabsList>
            {mockAccounts.map((account) => (
              <TabsTrigger key={account.id} value={account.id}>
                {account.challenge_type} - ${account.account_balance.toLocaleString()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${mockMetrics.balance.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Current Account Balance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Equity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${mockMetrics.equity.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Real-time Account Value</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockMetrics.winRate.toFixed(2)}%</p>
              <p className="text-sm text-gray-400">Success Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockMetrics.trades}</p>
              <p className="text-sm text-gray-400">Completed Trades</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Account Growth</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1" />
                  <span className="text-sm text-gray-400">Profit Target</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1" />
                  <span className="text-sm text-gray-400">Max Loss</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Only render ApexChart on the client side */}
              {isClient && (
                <ApexChartComponent
                  options={chartData.options}
                  series={chartData.series}
                  type="line"
                  height={350}
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Trading Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Minimum Trading Days</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">{mockMetrics.trades}/4 Days</p>
                    <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#ffc62d]" 
                        style={{ width: `${Math.min((mockMetrics.trades / 4) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Max Daily Loss</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-red-500">
                      ${mockMetrics.avgLoss.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">
                      Limit: ${(selectedAccount.account_balance * 0.05).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Max Loss</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">
                      ${(selectedAccount.account_balance * 0.05).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">5%</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Profit Target</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-green-500">
                      ${(selectedAccount.account_balance * 0.1).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">10%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Average Profit</p>
                  <p className="text-lg font-bold text-green-500">
                    ${mockMetrics.avgProfit.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Average Loss</p>
                  <p className="text-lg font-bold text-red-500">
                    ${mockMetrics.avgLoss.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Average RRR</p>
                  <p className="text-lg font-bold">
                    {mockMetrics.avgRRR.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Expectancy</p>
                  <p className={`text-lg font-bold ${
                    mockMetrics.expectancy >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    ${mockMetrics.expectancy.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Profit Factor</p>
                  <p className="text-lg font-bold">
                    {mockMetrics.profitFactor.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Volume</p>
                  <p className="text-lg font-bold">
                    {mockMetrics.lots.toFixed(2)} Lots
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Trading Journal</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1" />
                  <span className="text-sm text-gray-400">Buy</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1" />
                  <span className="text-sm text-gray-400">Sell</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTradingJournal.map((trade) => (
                      <TableRow key={trade.ticket}>
                        <TableCell className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                          {trade.type.toUpperCase()}
                        </TableCell>
                        <TableCell>{trade.symbol}</TableCell>
                        <TableCell>{trade.volume.toFixed(2)}</TableCell>
                        <TableCell className={trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}>
                          ${trade.profit.toFixed(2)}
                        </TableCell>
                        <TableCell>{trade.duration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </>

      {/* Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/50 flex flex-col items-center justify-start md:justify-center px-4 text-center z-20 pt-4 md:pt-0 overflow-y-auto">
        <div className="bg-[#111111] p-6 md:p-8 rounded-xl border border-gray-800 max-w-md w-full flex flex-col items-center my-4 md:my-0">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <LockClosedIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Please purchase an account to see your account metrics</h2>
          <div className="flex flex-col md:flex-row gap-4 w-full mt-4">
            <Link 
              href="/dashboard/challenge" 
              className="w-full md:w-auto flex-1 py-3 px-6 rounded-lg bg-[#ffc62d] hover:bg-[#e6b129] text-black font-semibold text-center transition-colors"
            >
              Get Challenge
            </Link>
            <Link 
              href="/dashboard/trading-arena" 
              className="w-full md:w-auto flex-1 py-3 px-6 rounded-lg bg-[#8B0000] hover:bg-[#6d0000] text-white font-semibold text-center transition-colors"
            >
              Trading Arenas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 