import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CREATE_INTENT_FOR_CUSTOMER_QUERY } from './graphql/queries';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { StripePaymentAdd } from './StripePaymentAdd';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || '');

export default function AddPaymentElement({
  kind,
  addPayment,
  savePayLoading
}: {
  kind: string;
  addPayment: any;
  savePayLoading: boolean;
}) {
  const [secret, setSecret] = useState('');

  const { data, refetch } = useQuery(CREATE_INTENT_FOR_CUSTOMER_QUERY, {
    variables: { kind },
    fetchPolicy: 'network-only' // Always fetch fresh data when refetching
  });

  useEffect(() => {
    const newSecret = data?.createIntentForCustomer?.clientSecret;

    if (newSecret && newSecret !== secret) {
      setSecret(newSecret);
    } else if (newSecret === secret) {
      refetch();
    }
  }, [data, secret, refetch]);

  const options = {
    clientSecret: secret
  };

  return secret ? (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentAdd save={addPayment} savePaymemtMethodLoading={savePayLoading} />
    </Elements>
  ) : null;
}
