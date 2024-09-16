export function parseSDKResponse<T>(response: T): T {
  return JSON.parse(JSON.stringify(response));
}

export const ErrorMessage = 'Something went wrong, please try again later';

export function getErrorMessage() {
  return { error: ErrorMessage, data: [], hasMore: false, totalRecords: 0 };
}

export function getPaymentReason(origin: string) {
  if (origin === 'web' || origin === 'subscription_charge') {
    return 'New';
  } else {
    return 'Renewal of ';
  }
}
