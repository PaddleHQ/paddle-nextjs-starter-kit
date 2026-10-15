'use server';

import { validateUserSession } from '@/utils/supabase/server';
import { Subscription } from '@paddle/paddle-node-sdk';
import { revalidatePath } from 'next/cache';
import { getPaddleInstance } from '@/utils/paddle/get-paddle-instance';
import { getCustomerId } from '@/utils/paddle/get-customer-id';

const paddle = getPaddleInstance();

interface Error {
  error: string;
}

export async function cancelSubscription(subscriptionId: string): Promise<Subscription | Error> {
  try {
    await validateUserSession();

    const customerId = await getCustomerId();
    const subscription = await paddle.subscriptions.get(subscriptionId);
    if (!customerId || subscription.customerId !== customerId) {
      return { error: 'Something went wrong, please try again later' };
    }

    const canceledSubscription = await paddle.subscriptions.cancel(subscriptionId, {
      effectiveFrom: 'next_billing_period',
    });
    if (canceledSubscription) {
      revalidatePath('/dashboard/subscriptions');
    }
    return JSON.parse(JSON.stringify(canceledSubscription));
  } catch (e) {
    console.log('Error canceling subscription', e);
    return { error: 'Something went wrong, please try again later' };
  }
}
