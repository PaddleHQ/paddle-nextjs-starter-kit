'use server';

import { getCustomerId } from '@/utils/paddle/get-customer-id';
import { getPaddleInstance } from '@/utils/paddle/get-paddle-instance';
import { SubscriptionResponse } from '@/lib/api.types';
import { getErrorMessage } from '@/utils/paddle/data-helpers';

export async function getSubscriptions(): Promise<SubscriptionResponse> {
  try {
    const customerId = await getCustomerId();
    if (customerId) {
      const subscriptionCollection = getPaddleInstance().subscriptions.list({ customerId: [customerId], perPage: 20 });
      const subscriptions = await subscriptionCollection.next();
      return {
        data: subscriptions,
        hasMore: subscriptionCollection.hasMore,
        totalRecords: subscriptionCollection.estimatedTotal,
      };
    }
  } catch (e) {
    return getErrorMessage();
  }
  return getErrorMessage();
}
