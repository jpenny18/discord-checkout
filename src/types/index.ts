export type PaymentMethod = 'card' | 'crypto' | 'application';
export type CryptoType = 'USDT' | 'BTC';

export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  discordUsername: string;
  phone?: string;
  country?: string;
  selectedPlan?: Plan;
  paymentMethod?: PaymentMethod;
  status?: 'pending' | 'completed' | 'failed';
}

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface PriceDisplay {
  amount: string;
  period: string;
  toString(): string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  priceDisplay: PriceDisplay | string;
  billingNote?: string;
  duration: string;
  features: PlanFeature[];
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

export interface ArenaEntry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  discordUsername?: string;
  selectedType: 'arena' | 'trial';
  accountSize?: string;
  platform: string;
  amount: number;
  paymentIntentId: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: { toDate: () => Date };
  completedAt?: { toDate: () => Date };
  customerId?: string;
  subscriptionId?: string;
} 