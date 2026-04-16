import { PaymentMethodDetails as PaddlePaymentMethodDetails } from '@paddle/paddle-node-sdk';
import { CreditCard } from 'lucide-react';

const PaymentMethodLabels: Record<PaddlePaymentMethodDetails['type'], string> = {
  card: 'Card',
  alipay: 'Alipay',
  wire_transfer: 'Wire Transfer',
  apple_pay: 'Apple Pay',
  google_pay: 'Google Pay',
  paypal: 'PayPal',
  ideal: 'iDEAL',
  bancontact: 'Bancontact',
  blik: 'BLIK',
  kakao_pay: 'Kakao Pay',
  korea_local: 'Korean Local Payment',
  south_korea_local_card: 'South Korea Local Card',
  mb_way: 'MB WAY',
  naver_pay: 'Naver Pay',
  payco: 'Payco',
  pix: 'Pix',
  samsung_pay: 'Samsung Pay',
  upi: 'UPI',
  wechat_pay: 'WeChat Pay',
  offline: 'Offline',
  unknown: 'Unknown',
};

interface Props {
  type: PaddlePaymentMethodDetails['type'];
  card?: PaddlePaymentMethodDetails['card'];
}

export function PaymentMethodDetails({ type, card }: Props) {
  if (type === 'card') {
    return (
      <>
        <CreditCard size={18} />
        <span className={'text-base text-secondary leading-4'}>**** {card?.last4}</span>
      </>
    );
  } else {
    return type ? <span className={'text-base text-secondary leading-4'}>{PaymentMethodLabels[type]}</span> : '-';
  }
}
