import { Plan } from '../types';

export const plans: Plan[] = [
  {
    id: 'cadet',
    name: 'Cadet',
    price: 99,
    duration: 'monthly',
    features: [
      'Access to all TRW Campuses',
      'Daily live broadcasts',
      'Daily course updates',
      'Basic support access',
      'Community forum access',
      'Monthly Q&A sessions'
    ],
    allowedPaymentMethods: ['card'],
  },
  {
    id: 'challenger',
    name: 'Challenger',
    price: 399,
    duration: '4 months',
    features: [
      'All Cadet features',
      'Priority support access',
      'Advanced training modules',
      'Weekly mentorship calls',
      'Private Discord channels',
      'Trading signals access'
    ],
    allowedPaymentMethods: ['card', 'crypto'],
    popular: true,
  },
  {
    id: 'hero',
    name: 'Hero',
    price: 499,
    duration: '1 year',
    features: [
      'All Challenger features',
      'VIP Discord access',
      'One-on-one mentoring',
      'Early access to new content',
      'Exclusive investment opportunities',
      'Direct line to founders'
    ],
    allowedPaymentMethods: ['crypto'],
  },
]; 