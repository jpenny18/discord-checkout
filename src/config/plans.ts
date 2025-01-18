import { Plan } from '../types';

export const plans: Plan[] = [
  {
    id: 'cadet',
    name: 'Ascendant Trader',
    price: 99,
    duration: 'monthly',
    features: [
      '🎥 LIVE Trading Room Access with Penny Pips Monday - Friday every morning',
      '🔴 300+ hours of education, trade recaps, and technical and psychology training',
      '🚨 Recieve trading signals/ideas everyday',
      '📝 Weekly educational sessions, recaps/outlooks, and Q&A every Sunday',
      '⭐️ Monthly Rewards/Giveaways',
      '🎁 Free $50,000 Challenge Account'
    ],
    allowedPaymentMethods: ['card'],
  },
  {
    id: 'challenger',
    name: 'Ascendant Challenger',
    price: 399,
    duration: '4 months',
    features: [
      'All Ascendant Trader features',
      'Priority support access',
      'Intermediate training modules',
      'Weekly mentorship calls',
      'Private Discord channels',
      '200% guarantee',
      '🎁 Free $100,000 Challenge Account'
    ],
    allowedPaymentMethods: ['card', 'crypto'],
    popular: true,
  },
  {
    id: 'hero',
    name: 'Ascendant Hero',
    price: 499,
    duration: '1 year',
    features: [
      'All Challenger features',
      'VIP Discord channels',
      'One-on-one mentoring',
      'Early access to new content',
      'Advanced training modules',
      '200% guarantee',
      '🎁 Free $500,000 Challenge Account'
    ],
    allowedPaymentMethods: ['crypto'],
  },
]; 