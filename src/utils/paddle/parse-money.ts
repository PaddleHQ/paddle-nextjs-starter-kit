export function convertAmountFromLowestUnit(amount: string, currency: string) {
  switch (currency) {
    case 'JPY':
    case 'KRW':
      return parseFloat(amount);
    default:
      return parseFloat(amount) / 100;
  }
}

export function parseMoney(amount: string = '0', currency: string = 'USD') {
  const parsedAmount = convertAmountFromLowestUnit(amount, currency);
  return formatMoney(parsedAmount, currency);
}

export function formatMoney(amount: number = 0, currency: string = 'USD') {
  const language = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  return new Intl.NumberFormat(language ?? 'en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}
