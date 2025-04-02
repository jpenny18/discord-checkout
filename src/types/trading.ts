export interface TradingAccount {
  id: string;
  name: string;
  login: string;
  server: string;
  type: 'demo' | 'live';
  platform: 'mt4' | 'mt5';
  broker: string;
  balance: number;
  equity: number;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  createdAt: string;
  updatedAt: string;
} 