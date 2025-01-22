export type PaymentMethod = 'card' | 'crypto';
export type CryptoType = 'USDT' | 'BTC';

export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  discordUsername: string;
  selectedPlan?: Plan;
  paymentMethod?: PaymentMethod;
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

export interface Order extends Omit<UserData, 'timestamp'> {
  id: string;
  amount: number;
  plan?: string;
  duration?: string;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  cryptoType?: CryptoType;
  walletAddress?: string;
  transactionHash?: string;
  timestamp?: {
    toDate: () => Date;
  };
  createdAt?: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: PaymentMethod;
  isRecurring?: boolean;
  billingInterval?: string;
  billingIntervalCount?: number;
  // Challenge-specific fields
  challengeType?: string;
  challengeAmount?: string;
  platform?: string;
}

export interface CryptoPayment {
  amount: number;
  cryptoType: CryptoType;
  walletAddress: string;
  orderId: string;
} 