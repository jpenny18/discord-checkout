# Discord Checkout App

A modern, secure checkout system built with Next.js, Stripe, and Firebase. Features both credit card and cryptocurrency payment options.

## Features

- Modern UI with Tailwind CSS
- Stripe integration for credit card payments
- Cryptocurrency payments (USDT)
- Firebase integration for order tracking
- Admin dashboard
- Discord username integration
- Responsive design
- Type-safe with TypeScript

## Prerequisites

- Node.js 18+ and npm
- Stripe account
- Firebase project
- Vercel account (for deployment)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Firebase Admin
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key

# Crypto Settings
NEXT_PUBLIC_WALLET_ADDRESS=your_crypto_wallet_address
NEXT_PUBLIC_CRYPTO_API_KEY=your_coingecko_api_key

# Admin Settings
ADMIN_EMAIL=your_admin_email

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables as described above
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## Usage

### Checkout Flow

1. User selects a plan
2. Fills in personal information including Discord username
3. Chooses payment method (credit card or crypto, depending on plan)
4. Completes payment
5. Order is stored in Firebase

### Admin Dashboard

Access the admin dashboard at `/admin` to view all orders and their status.

## Security

- All sensitive keys are stored as environment variables
- Stripe handles credit card processing securely
- Firebase Rules should be set up to restrict access to orders

## Customization

### Membership Plans

Edit `src/config/plans.ts` to modify:

- Plan names
- Prices
- Features
- Payment method restrictions

### Styling

The app uses Tailwind CSS for styling. Customize the theme in `tailwind.config.js`.
