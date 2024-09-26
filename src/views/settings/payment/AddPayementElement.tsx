import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
// import { CREATE_INTENT_FOR_CUSTOMER_QUERY } from './graphql/queries';
// import { useQuery } from '@apollo/client';
// import { useEffect, useState } from 'react';
import { StripePaymentAdd } from './StripePaymentAdd';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || '');

export default function AddPaymentElement({
  // kind,
  addPayment,
  savePayLoading,
  clientSecret
}: {
  // kind: string;
  addPayment: any;
  savePayLoading: boolean;
  clientSecret: any;
}) {
  const options = {
    clientSecret: clientSecret
  };
  return clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentAdd save={addPayment} savePaymemtMethodLoading={savePayLoading} />
    </Elements>
  ) : null;
}
