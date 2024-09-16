import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CREATE_INTENT_FOR_CUSTOMER_QUERY } from './graphql/queries';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { StripePaymentAdd } from './StripePaymentAdd';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  'pk_test_51Mc0MNEr2SjM3rR4LaEDHNLk03VqGvBNMIOOQ4Khtyo2gS5mJp0nMAiVPPeianRFTJcXiPVJZitbibx2KJQU73r500F7Rpyih7'
);

export default function AddPaymentElement({
  kind,
  savePaymentLoading
}: {
  kind: string;
  savePaymentLoading?: boolean;
}) {
  const { data } = useQuery(CREATE_INTENT_FOR_CUSTOMER_QUERY, {
    variables: {
      kind: kind
    }
  });
  const [secret, setSecret] = useState('');
  // useEffect(() => {
  //   if (data?.getEphemeralKey) setSecret(`${data?.getEphemeralKey?.data?.keyId}_secret_${data?.getEphemeralKey?.data?.keySecret}`);
  // }, [data?.getEphemeralKey]);

  useEffect(() => {
    if (data?.createIntentForCustomer) setSecret(`${data?.createIntentForCustomer?.clientSecret}`);
  }, [data?.createIntentForCustomer]);
  const options = {
    clientSecret: secret
  };

  return secret ? (
    <>
      <Elements stripe={stripePromise} options={options}>
        <StripePaymentAdd {...{ savePaymentLoading }} />
      </Elements>
    </>
  ) : null;
}

