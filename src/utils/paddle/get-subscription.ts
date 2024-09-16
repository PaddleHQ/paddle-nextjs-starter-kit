'use server';

import { getCustomerId } from '@/utils/paddle/get-customer-id';
import { ErrorMessage, parseSDKResponse } from '@/utils/paddle/data-helpers';
import { getPaddleInstance } from '@/utils/paddle/get-paddle-instance';
import { SubscriptionDetailResponse } from '@/lib/api.types';

export async function getSubscription(subscriptionId: string): Promise<SubscriptionDetailResponse> {
  try {
    const customerId = await getCustomerId();
    if (customerId) {
      const subscription = await getPaddleInstance().subscriptions.get(subscriptionId, {
        include: ['next_transaction', 'recurring_transaction_details'],
      });

      return { data: parseSDKResponse(subscription) };
    }
  } catch (e) {
    return { error: ErrorMessage };
  }
  return { error: ErrorMessage };
}
