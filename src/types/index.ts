export type PaymentMethod = 'card' | 'crypto';
export type CryptoType = 'USDT' | 'BTC';

export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  discordUsername: string;
  selectedPlan?: Plan;
  paymentMethod?: PaymentMethod;
  timestamp?: Date;
  status?: 'pending' | 'completed' | 'failed';
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  allowedPaymentMethods: PaymentMethod[];
}

export interface Order extends UserData {
  id: string;
  amount: number;
  stripePaymentIntentId?: string;
  cryptoType?: CryptoType;
  walletAddress?: string;
  transactionHash?: string;
}

export interface CryptoPayment {
  amount: number;
  cryptoType: CryptoType;
  walletAddress: string;
  orderId: string;
} 