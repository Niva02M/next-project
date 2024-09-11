import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { Button, Typography } from '@mui/material';
import { GET_EPHEMERAL_KEY_QUERY } from './graphql/queries';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  'pk_test_51Mc0MNEr2SjM3rR4LaEDHNLk03VqGvBNMIOOQ4Khtyo2gS5mJp0nMAiVPPeianRFTJcXiPVJZitbibx2KJQU73r500F7Rpyih7'
);

export default function AddPaymentElement({ kind }: { kind: string }) {
  const { data } = useQuery(GET_EPHEMERAL_KEY_QUERY);
  const [secret, setSecret] = useState('');
  useEffect(() => {
    if (data?.getEphemeralKey) setSecret(`${data?.getEphemeralKey?.data?.keyId}_secret_${data?.getEphemeralKey?.data?.keySecret}`);
  }, [data?.getEphemeralKey]);
  const options = {
    mode: 'payment',
    amount: 1099,
    currency: 'usd',
    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    }
  };

  return secret ? (
    <>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    </>
  ) : null;
}

