'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import dynamic from 'next/dynamic';
import { initializeMetaApi, getMetaApiInstance } from '@/lib/metaapi';
import type { AccountMetrics, Trade } from '@/lib/metaapi';
import { ApexOptions } from 'apexcharts';

// Dynamically import ApexCharts with no SSR
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TradingAccount {
  id: string;
  user_id: string;
  mt_login: string;
  mt_password: string;
  meta_api_token: string;
  account_id: string;
  challenge_type: string;
  account_balance: number;
  status: 'in_progress' | 'passed' | 'failed';
}

interface ChartData {
  series: {
    name: string;
    data: { x: Date; y: number; }[];
  }[];
  options: ApexOptions;
}

export default function MyAccountsPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<TradingAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false); // Add this to track client-side rendering
  const [accountMetrics, setAccountMetrics] = useState<AccountMetrics>({
    balance: 0,
    equity: 0,
    trades: 0,
    lots: 0,
    winRate: 0,
    avgProfit: 0,
    avgLoss: 0,
    avgRRR: 0,
    expectancy: 0,
    profitFactor: 0
  });
  const [tradingJournal, setTradingJournal] = useState<Trade[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    series: [{
      name: 'Equity',
      data: []
    }],
    options: {
      chart: {
        type: 'line',
        height: 350,
        background: '#000000',
        foreColor: '#ffffff',
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          dynamicAnimation: {
            speed: 1000
          }
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
            y: 0,
            borderColor: '#00ff00',
            label: {
              text: 'Profit Target',
              style: {
                color: '#ffffff'
              }
            }
          },
          {
            y: 0,
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

  // Add this useEffect to detect client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (user?.uid && isClient) {
      console.log('User authenticated, fetching accounts...');
      fetchAccounts();
    }
  }, [user, isClient]);

  const fetchAccounts = async () => {
    try {
      console.log('Starting fetchAccounts...');
      const accountsRef = collection(db, 'trading_accounts');
      const q = query(accountsRef, where('user_id', '==', user?.uid));
      const snapshot = await getDocs(q);
      const accountsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TradingAccount[];
      
      console.log('Fetched accounts:', accountsData);
      setAccounts(accountsData);
      
      if (accountsData.length > 0) {
        console.log('Setting initial account:', accountsData[0]);
        setSelectedAccount(accountsData[0]);
        await connectAndFetchData(accountsData[0]);
      }
    } catch (error) {
      console.error('Error in fetchAccounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectAndFetchData = async (account: TradingAccount) => {
    if (!isClient) return; // Skip if not client
    
    console.log('Starting connectAndFetchData for account:', {
      id: account.id,
      login: account.mt_login,
      accountId: account.account_id
    });

    try {
      let metaApi = getMetaApiInstance();
      console.log('Current MetaAPI instance:', metaApi ? 'exists' : 'null');
      
      if (!metaApi) {
        console.log('Initializing new MetaAPI instance with token');
        metaApi = await initializeMetaApi(account.meta_api_token);
      }

      console.log('Attempting to connect account...');
      const isConnected = await metaApi.connectAccount(
        account.account_id,
        account.mt_login,
        account.mt_password,
        'MetaQuotes-Demo'
      );
      console.log('Account connection status:', isConnected);

      if (isConnected) {
        console.log('Fetching account metrics...');
        const metrics = await metaApi.getAccountMetrics(account.account_id);
        console.log('Received metrics:', metrics);
        
        if (metrics) {
          console.log('Setting account metrics in state');
          setAccountMetrics(metrics);
        }

        console.log('Fetching closed trades...');
        const trades = await metaApi.getClosedTrades(account.account_id);
        console.log('Received trades:', trades);
        setTradingJournal(trades);

        console.log('Fetching equity history...');
        const equityHistory = await metaApi.getEquityHistory(account.account_id);
        console.log('Received equity history:', equityHistory);
        
        if (equityHistory.length === 0 && metrics) {
          console.log('No equity history, creating initial point');
          equityHistory.push({
            x: new Date(),
            y: metrics.equity
          });
        }

        setChartData(prev => ({
          ...prev,
          series: [{
            name: 'Equity',
            data: equityHistory
          }],
          options: {
            ...prev.options,
            annotations: {
              yaxis: [
                {
                  y: account.account_balance + (account.account_balance * 0.1),
                  borderColor: '#00ff00',
                  label: {
                    text: 'Profit Target',
                    style: {
                      color: '#ffffff'
                    }
                  }
                },
                {
                  y: account.account_balance - (account.account_balance * 0.05),
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
      } else {
        console.error('Failed to connect to account');
      }
    } catch (error) {
      console.error('Error in connectAndFetchData:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (accounts.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold text-white mb-4">My Trading Accounts</h1>
        <p className="text-gray-400">No trading accounts found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">My Trading Accounts</h1>
        <Tabs 
          value={selectedAccount?.id} 
          onValueChange={async (value) => {
            const account = accounts.find(a => a.id === value);
            if (account) {
              setSelectedAccount(account);
              await connectAndFetchData(account);
            }
          }}
        >
          <TabsList>
            {accounts.map((account) => (
              <TabsTrigger key={account.id} value={account.id}>
                {account.challenge_type} - ${account.account_balance.toLocaleString()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {selectedAccount && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${accountMetrics.balance.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Current Account Balance</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Equity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${accountMetrics.equity.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Real-time Account Value</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{accountMetrics.winRate.toFixed(2)}%</p>
                <p className="text-sm text-gray-400">Success Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{accountMetrics.trades}</p>
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
                  <ApexChart
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
                      <p className="text-lg font-bold">{accountMetrics.trades}/4 Days</p>
                      <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#ffc62d]" 
                          style={{ width: `${Math.min((accountMetrics.trades / 4) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Max Daily Loss</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-red-500">
                        ${accountMetrics.avgLoss.toFixed(2)}
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
                      ${accountMetrics.avgProfit.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Average Loss</p>
                    <p className="text-lg font-bold text-red-500">
                      ${accountMetrics.avgLoss.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Average RRR</p>
                    <p className="text-lg font-bold">
                      {accountMetrics.avgRRR.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Expectancy</p>
                    <p className={`text-lg font-bold ${
                      accountMetrics.expectancy >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      ${accountMetrics.expectancy.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Profit Factor</p>
                    <p className="text-lg font-bold">
                      {accountMetrics.profitFactor.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Volume</p>
                    <p className="text-lg font-bold">
                      {accountMetrics.lots.toFixed(2)} Lots
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
                      {tradingJournal.map((trade) => (
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
      )}
    </div>
  );
} 