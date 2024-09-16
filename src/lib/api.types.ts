import { Subscription, Transaction } from '@paddle/paddle-node-sdk';

export interface SubscriptionResponse {
  data?: Subscription[];
  hasMore: boolean;
  totalRecords: number;
  error?: string;
}

export interface TransactionResponse {
  data?: Transaction[];
  hasMore: boolean;
  totalRecords: number;
  error?: string;
}

export interface SubscriptionDetailResponse {
  data?: Subscription;
  error?: string;
}
