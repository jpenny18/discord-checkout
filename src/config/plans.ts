import { Plan, PriceDisplay } from '@/types/index';

const createPriceDisplay = (amount: string, period: string): PriceDisplay => ({
  amount,
  period,
  toString: () => `${amount} ${period}`
});

export const plans: Plan[] = [
  {
    id: 'lite',
    name: 'Ascendant LITE',
    price: 7,
    priceDisplay: createPriceDisplay('$1', 'per day (weekly)'),
    duration: 'weekly',
    features: [
      { name: '8 chat channels', included: true },
      { name: 'Exclusive deals', included: true },
      { name: 'Limited education material', included: true },
      { name: 'Limited livestreams', included: true },
      { name: 'Limited Trade Alerts', included: true },
      { name: 'Penny Pips Write-Ups & Livestreams', included: false },
      { name: 'Research Desk', included: false },
      { name: 'Monthly Rewards/Giveaways', included: false },
      { name: '200% Guarantee', included: false },
      { name: 'Free $50,000 Challenge Account', included: false },
      { name: 'AI Trading Assistant', included: false },
      { name: 'White glove support', included: false },
      { name: 'Copytrading', included: false },
      { name: 'Mentorship Program', included: false },
    ],
    allowedPaymentMethods: ['card'],
  },
  {
    id: 'platinum',
    name: 'Ascendant PLATINUM',
    price: 199,
    priceDisplay: createPriceDisplay('$199', 'per month'),
    duration: 'monthly',
    features: [
      { name: '20 chat channels', included: true },
      { name: 'Exclusive deals', included: true },
      { name: 'Education material', included: true },
      { name: 'Livestreams', included: true },
      { name: 'Trade Alerts', included: true },
      { name: 'Penny Pips Write-Ups & Livestreams', included: true },
      { name: 'Research Desk', included: true },
      { name: 'Monthly Rewards/Giveaways', included: true },
      { name: '200% Guarantee', included: true },
      { name: 'Free $50,000 Challenge Account', included: true },
      { name: 'AI Trading Assistant', included: false },
      { name: 'White glove support', included: false },
      { name: 'Copytrading', included: false },
      { name: 'Mentorship Program', included: false },
    ],
    allowedPaymentMethods: ['card', 'crypto'],
    popular: true,
  },
  {
    id: 'elite',
    name: 'Ascendant ELITE',
    price: 0,
    priceDisplay: createPriceDisplay('Application Only', 'registration open'),
    duration: 'application',
    features: [
      { name: '25 chat channels', included: true },
      { name: 'Exclusive deals', included: true },
      { name: 'Education material', included: true },
      { name: 'Livestreams', included: true },
      { name: 'Trade Alerts', included: true },
      { name: 'Penny Pips Write-Ups & Livestreams', included: true },
      { name: 'Research Desk', included: true },
      { name: 'Monthly Rewards/Giveaways', included: true },
      { name: '200% Guarantee', included: true },
      { name: 'Free $50,000 Challenge Account', included: true },
      { name: 'AI Trading Assistant', included: true },
      { name: 'White glove support', included: true },
      { name: 'Copytrading', included: true },
      { name: 'Mentorship Program', included: true },
    ],
    allowedPaymentMethods: ['application'],
  },
]; 