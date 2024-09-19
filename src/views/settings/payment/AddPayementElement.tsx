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

  const { data } = useQuery(CREATE_INTENT_FOR_CUSTOMER_QUERY, {
    variables: {
      kind: kind
    }
  });

  useEffect(() => {
    if (data?.createIntentForCustomer) setSecret(`${data?.createIntentForCustomer?.clientSecret}`);
  }, [data?.createIntentForCustomer]);
  const options = {
    clientSecret: secret
  };

  return secret ? (
    <>
      <Elements stripe={stripePromise} options={options}>
        <StripePaymentAdd save={addPayment} {...{ savePayLoading }} />
      </Elements>
    </>
  ) : null;
}
