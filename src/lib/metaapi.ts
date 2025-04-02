import MetaApi, { 
  MetaStats, 
  RpcMetaApiConnectionInstance,
  MetatraderAccount,
  MetatraderOrder,
  ConnectionHealthStatus,
  MetatraderAccountInformation,
  MetatraderHistoryOrders,
  MetatraderDeals,
  MetatraderDeal,
  NewMetatraderAccountDto,
  AccountType
} from 'metaapi.cloud-sdk';

const API_KEY = process.env.NEXT_PUBLIC_META_API_TOKEN;
const ACCOUNT_ID = process.env.NEXT_PUBLIC_META_API_ACCOUNT_ID;

if (!API_KEY) {
  throw new Error('META_API_TOKEN is not defined');
}

const api = new MetaApi(API_KEY);

// Create a narrowed down token for web usage
async function createWebToken() {
  try {
    const token = await api.tokenManagementApi.narrowDownToken({
      applications: ['metaapi-api'],
      roles: ['reader', 'trader'],
      resources: ACCOUNT_ID ? [{entity: 'account', id: ACCOUNT_ID}] : undefined
    }, 24); // 24 hours validity
    return token;
  } catch (error) {
    console.error('Error creating web token:', error);
    throw error;
  }
}

export interface AccountMetrics {
  balance: number;
  equity: number;
  trades: number;
  lots: number;
  winRate: number;
  avgProfit: number;
  avgLoss: number;
  avgRRR: number;
  expectancy: number;
  profitFactor: number;
}

export interface Trade {
  ticket: string;
  type: 'buy' | 'sell';
  volume: number;
  symbol: string;
  openPrice: number;
  closePrice: number;
  profit: number;
  duration: number;
  openTime: Date;
  closeTime: Date;
}

interface MetatraderHistoryOrder extends MetatraderOrder {
  state: string;
  openTime: string;
  closeTime?: string;
  closePrice?: number;
  profit: number;
}

interface MetatraderDealExt extends Omit<MetatraderDeal, 'entryType' | 'time'> {
  profit: number;
  time: Date;
  entryType: 'DEAL_ENTRY_IN' | 'DEAL_ENTRY_OUT' | 'DEAL_ENTRY_INOUT' | 'DEAL_ENTRY_OUT_BY';
}

interface WebhookPayload {
  eventType: 'profitTargetReached' | 'maxLossBreached' | 'dailyLossBreached' | 'objectivesMet';
  accountId: string;
  data: Record<string, any>;
}

interface TradingObjectives {
  minTradingDays: number;
  maxDailyLoss: number;
  maxLoss: number;
  profitTarget: number;
}

interface SynchronizationListener {
  onAccountInformationUpdated: (accountInfo: MetatraderAccountInformation) => void;
  onPositionsUpdated: (positions: MetatraderOrder[]) => void;
  onDealsUpdated: (deals: MetatraderDeal[]) => void;
}

type Reliability = 'high' | 'medium' | 'low';

class MetaApiService {
  private api: MetaApi;
  private connections: Map<string, RpcMetaApiConnectionInstance> = new Map();
  private debug: boolean = true;
  private objectives: Map<string, TradingObjectives> = new Map();
  private lastDailyReset: Map<string, Date> = new Map();
  private dailyStats: Map<string, { startBalance: number; lowBalance: number }> = new Map();

  constructor(token: string) {
    console.log('Initializing MetaApiService');
    this.api = new MetaApi(token);
  }

  private log(...args: any[]) {
    if (this.debug) {
      console.log('[MetaAPI]', ...args);
    }
  }

  async connectAccount(accountId: string, login: string, password: string, serverName: string) {
    try {
      this.log('Connecting account:', accountId);
      let account = await this.api.metatraderAccountApi.getAccount(accountId);
      
      this.log('Account state:', {
        state: account?.state,
        connectionStatus: account?.connectionStatus,
        reliability: account?.reliability
      });
      
      // Check account state before deploying
      const deployedStates = ['DEPLOYING', 'DEPLOYED'];
      const initialState = account?.state;
      
      if (!account) {
        this.log('Account not found, creating new account');
        const accountData: NewMetatraderAccountDto = {
          name: `Account ${login}`,
          type: 'cloud-g2',
          login,
          password,
          server: serverName,
          platform: 'mt5',
          magic: 0,
          region: 'london',
          baseCurrency: 'USD',
          reliability: 'high'
        };
        
        this.log('Creating account with config:', accountData);
        account = await this.api.metatraderAccountApi.createAccount(accountData);
        this.log('Account created:', {
          id: account.id,
          state: account.state,
          connectionStatus: account.connectionStatus
        });
      }

      if (!deployedStates.includes(initialState)) {
        this.log('Deploying account');
        await account.deploy();
        this.log('Account deployed');
      }
      
      this.log('Waiting for connection');
      await account.waitConnected();
      this.log('Account connected');

      const connection = account.getRPCConnection();
      this.log('Establishing RPC connection');
      await connection.connect();
      this.log('RPC connection established');
      
      this.log('Waiting for synchronization');
      await connection.waitSynchronized();
      this.log('Synchronization complete');

      // Test data access
      const accountInfo = await connection.getAccountInformation();
      this.log('Account information:', accountInfo);
      
      const historyOrders = await connection.getHistoryOrdersByTimeRange(
        new Date('2020-01-01'),
        new Date()
      );
      this.log('History orders test:', {
        received: Array.isArray(historyOrders),
        count: Array.isArray(historyOrders) ? historyOrders.length : 0
      });

      this.connections.set(accountId, connection);
      this.log('Account successfully connected');
      return true;
    } catch (error) {
      this.log('Error connecting account:', error);
      return false;
    }
  }

  private initializeDailyTracking(accountId: string, balance: number) {
    this.lastDailyReset.set(accountId, new Date());
    this.dailyStats.set(accountId, {
      startBalance: balance,
      lowBalance: balance
    });
  }

  private async checkTradingObjectives(accountId: string, accountInfo: MetatraderAccountInformation) {
    const objectives = this.objectives.get(accountId);
    if (!objectives) return;

    const dailyStats = this.dailyStats.get(accountId);
    if (!dailyStats) return;

    // Check max loss
    const totalDrawdown = accountInfo.balance - accountInfo.equity;
    if (totalDrawdown >= objectives.maxLoss) {
      await this.triggerWebhook({
        eventType: 'maxLossBreached',
        accountId,
        data: { drawdown: totalDrawdown }
      });
    }

    // Check daily loss
    const dailyDrawdown = dailyStats.startBalance - accountInfo.balance;
    if (dailyDrawdown >= objectives.maxDailyLoss) {
      await this.triggerWebhook({
        eventType: 'dailyLossBreached',
        accountId,
        data: { dailyLoss: dailyDrawdown }
      });
    }

    // Check profit target
    const profit = accountInfo.balance - dailyStats.startBalance;
    if (profit >= objectives.profitTarget) {
      await this.triggerWebhook({
        eventType: 'profitTargetReached',
        accountId,
        data: { profit }
      });
    }
  }

  private async triggerWebhook(payload: WebhookPayload) {
    try {
      const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;
      if (!webhookUrl) return;

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      this.log('Webhook triggered:', payload.eventType);
    } catch (error) {
      this.log('Webhook error:', error);
    }
  }

  private updateDailyStats(accountId: string, positions: any[]) {
    const stats = this.dailyStats.get(accountId);
    if (!stats) return;

    const lastReset = this.lastDailyReset.get(accountId);
    const now = new Date();

    // Reset daily stats at midnight
    if (lastReset && lastReset.getDate() !== now.getDate()) {
      const connection = this.connections.get(accountId);
      if (connection) {
        connection.getAccountInformation().then(info => {
          this.initializeDailyTracking(accountId, info.balance);
        });
      }
    }
  }

  private async processDealUpdates(accountId: string, deals: MetatraderDeal[]) {
    const connection = this.connections.get(accountId);
    if (!connection) return;

    // Update metrics after new deals
    await this.getAccountMetrics(accountId);
  }

  async getAccountMetrics(accountId: string): Promise<AccountMetrics | null> {
    try {
      this.log('getAccountMetrics - Starting for account:', accountId);
      const connection = this.connections.get(accountId);
      if (!connection) {
        this.log('getAccountMetrics - No connection found');
        throw new Error('Account not connected');
      }

      // Get account information and trades in parallel
      const [accountInfo, trades] = await Promise.all([
        connection.getAccountInformation(),
        this.getClosedTrades(accountId)
      ]);

      this.log('getAccountMetrics - Account info:', accountInfo);
      this.log('getAccountMetrics - Trades received:', trades.length);

      // Calculate metrics from trades
      const validTrades = trades.filter(t => !isNaN(t.profit) && t.profit !== 0);
      const winningTrades = validTrades.filter(t => t.profit > 0);
      const losingTrades = validTrades.filter(t => t.profit < 0);

      const totalProfit = winningTrades.reduce((sum, t) => sum + t.profit, 0);
      const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.profit, 0));
      
      const avgProfit = winningTrades.length > 0 ? totalProfit / winningTrades.length : 0;
      const avgLoss = losingTrades.length > 0 ? totalLoss / losingTrades.length : 0;

      const metrics: AccountMetrics = {
        balance: accountInfo.balance || 0,
        equity: accountInfo.equity || 0,
        trades: validTrades.length,
        lots: validTrades.reduce((sum, t) => sum + t.volume, 0),
        winRate: validTrades.length > 0 ? (winningTrades.length / validTrades.length) * 100 : 0,
        avgProfit: Math.abs(avgProfit),
        avgLoss: Math.abs(avgLoss),
        avgRRR: avgLoss > 0 ? avgProfit / avgLoss : 0,
        expectancy: validTrades.length > 0 ? 
          (avgProfit * (winningTrades.length / validTrades.length)) - 
          (avgLoss * (losingTrades.length / validTrades.length)) : 0,
        profitFactor: totalLoss > 0 ? totalProfit / totalLoss : 0
      };

      this.log('getAccountMetrics - Calculated metrics:', metrics);
      return metrics;
    } catch (error) {
      this.log('getAccountMetrics - Error:', error);
      return null;
    }
  }

  async isConnected(accountId: string): Promise<boolean> {
    try {
      const connection = this.connections.get(accountId);
      if (!connection) {
        return false;
      }
      
      try {
        // Try to get account information as a connection test
        await connection.getAccountInformation();
        return true;
      } catch {
        return false;
      }
    } catch {
      return false;
    }
  }

  async getClosedTrades(accountId: string): Promise<Trade[]> {
    try {
      this.log('getClosedTrades - Starting for account:', accountId);
      const connection = this.connections.get(accountId);
      if (!connection) {
        this.log('getClosedTrades - No connection found');
        throw new Error('Account not connected');
      }

      // Get all history orders first
      const historyOrders = await connection.getHistoryOrdersByTimeRange(
        new Date('2020-01-01'),
        new Date('2026-01-01')
      );

      this.log('Retrieved history orders:', Array.isArray(historyOrders) ? historyOrders.length : 0);

      // Process each history order
      const trades: Trade[] = [];
      if (Array.isArray(historyOrders)) {
        for (const order of historyOrders) {
          if (!order?.positionId) continue;

          // Get deals specifically for this position
          const positionDeals = await connection.getDealsByPosition(order.positionId);
          this.log(`Processing position ${order.positionId}, found ${Array.isArray(positionDeals) ? positionDeals.length : 0} deals`);
          
          if (!Array.isArray(positionDeals) || positionDeals.length === 0) continue;

          // Sort deals by time
          const sortedDeals = positionDeals.sort((a, b) => 
            new Date(a.time || 0).getTime() - new Date(b.time || 0).getTime()
          );

          const openDeal = sortedDeals[0];
          const closeDeal = sortedDeals[sortedDeals.length - 1];

          if (openDeal && closeDeal && openDeal !== closeDeal) {
            const trade: Trade = {
              ticket: String(order.id || ''),
              type: (order.type || 'buy').toLowerCase() as 'buy' | 'sell',
              volume: order.volume || 0,
              symbol: order.symbol || '',
              openPrice: openDeal.price || order.openPrice || 0,
              closePrice: closeDeal.price || order.closePrice || 0,
              profit: closeDeal.profit || order.profit || 0,
              duration: this.calculateDuration(
                new Date(openDeal.time || order.openTime || Date.now()),
                new Date(closeDeal.time || order.closeTime || Date.now())
              ),
              openTime: new Date(openDeal.time || order.openTime || Date.now()),
              closeTime: new Date(closeDeal.time || order.closeTime || Date.now())
            };

            this.log('Created trade:', trade);
            trades.push(trade);
          }
        }
      }

      this.log('getClosedTrades - Final trades:', {
        totalTrades: trades.length,
        trades: trades
      });

      return trades;
    } catch (error) {
      this.log('getClosedTrades - Error:', error);
      return [];
    }
  }

  async getEquityHistory(accountId: string): Promise<{ x: Date; y: number }[]> {
    try {
      const connection = this.connections.get(accountId);
      if (!connection) {
        throw new Error('Account not connected');
      }

      const [deals, accountInfo] = await Promise.all([
        connection.getDealsByTimeRange(
          new Date('2020-01-01'),
          new Date('2026-01-01')
        ),
        connection.getAccountInformation()
      ]);

      // Ensure we have an array to work with
      const dealsArray = Array.isArray(deals) ? [...deals] : [];
      
      // Start with current equity
      const equityPoints = new Map<string, number>();
      let currentEquity = accountInfo.equity;

      // Add current point
      equityPoints.set(new Date().toISOString().split('T')[0], currentEquity);

      // Process historical deals
      dealsArray
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .forEach((deal) => {
          if (deal && deal.time && deal.profit) {
            const date = new Date(deal.time);
            const dateKey = date.toISOString().split('T')[0];
            currentEquity -= deal.profit;
            equityPoints.set(dateKey, currentEquity);
          }
        });

      const points = Array.from(equityPoints.entries())
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        .map(([dateStr, equity]) => ({
          x: new Date(dateStr),
          y: equity
        }));

      this.log('Equity history points:', points.length);
      return points;
    } catch (error) {
      console.error('Error getting equity history:', error);
      return [];
    }
  }

  private calculateDuration(openTime: Date, closeTime: Date): number {
    const duration = closeTime.getTime() - openTime.getTime();
    return Math.floor(duration / (1000 * 60 * 60)); // Return duration in hours
  }

  async disconnect(accountId: string) {
    const connection = this.connections.get(accountId);
    if (connection) {
      await connection.close();
      this.connections.delete(accountId);
    }
  }
}

let instance: MetaApiService | null = null;

export function initializeMetaApi(token: string) {
  if (!instance) {
    instance = new MetaApiService(token);
  }
  return instance;
}

export function getMetaApiInstance() {
  return instance;
}

export async function getMetaApiConnection() {
  try {
    const account = await api.metatraderAccountApi.getAccount(ACCOUNT_ID!);
    const connection = account.getRPCConnection();
    await connection.connect();
    return connection;
  } catch (error) {
    console.error('Failed to connect to MetaAPI:', error);
    throw error;
  }
}

export async function disconnectMetaApi(connection: RpcMetaApiConnectionInstance) {
  try {
    await connection.close();
  } catch (error) {
    console.error('Failed to disconnect from MetaAPI:', error);
  }
} 