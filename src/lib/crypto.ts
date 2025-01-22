// Fetch BTC price from CoinGecko API
export async function getBtcPrice(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    );
    const data = await response.json();
    return data.bitcoin.usd;
  } catch (error) {
    console.error('Error fetching BTC price:', error);
    throw error;
  }
}

// Fetch USDT price (should always be close to 1 USD)
export async function getUsdtPrice(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd'
    );
    const data = await response.json();
    return data.tether.usd;
  } catch (error) {
    console.error('Error fetching USDT price:', error);
    throw error;
  }
}

// Validate BTC address format
export function isValidBtcAddress(address: string): boolean {
  // Basic BTC address validation (you might want to use a more robust validation library)
  const btcRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[ac-hj-np-z02-9]{11,71}$/;
  return btcRegex.test(address);
}

// Validate USDT (TRC20) address format
export function isValidUsdtAddress(address: string): boolean {
  // Basic USDT TRC20 address validation
  const trc20Regex = /^T[A-Za-z1-9]{33}$/;
  return trc20Regex.test(address);
}

// Format crypto amount with appropriate decimal places
export function formatCryptoAmount(amount: number, currency: 'BTC' | 'USDT'): string {
  return currency === 'BTC' ? amount.toFixed(8) : amount.toFixed(2);
} 