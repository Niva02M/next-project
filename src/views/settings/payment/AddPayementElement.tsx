// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import CheckoutForm from './CheckoutForm';
import { Button, Typography } from '@mui/material';
import { GET_EPHEMERAL_KEY_QUERY } from './graphql/queries';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(
//   'pk_test_51Mc0MNEr2SjM3rR4LaEDHNLk03VqGvBNMIOOQ4Khtyo2gS5mJp0nMAiVPPeianRFTJcXiPVJZitbibx2KJQU73r500F7Rpyih7'
// );

export default function AddPaymentElement({ kind }: { kind: string }) {
  const { data } = useQuery(GET_EPHEMERAL_KEY_QUERY);
  // console.log('stripePromise ====>', stripePromise);
  const [secret, setSecret] = useState('');
  console.log('data ====>', data);
  // `${resData.id}_secret_${resData.clientSecret}`
  useEffect(() => {
    if (data?.getEphemeralKey) setSecret(`${data?.getEphemeralKey?.data?.keyId}_secret_${data?.getEphemeralKey?.data?.keySecret}`);
    console.log('options -===>', secret);
  }, [data?.getEphemeralKey]);
  return secret ? (
    <>
      {/*<Elements stripe={stripePromise} options={{ clientSecret: secret }}>
        <CheckoutForm />
      </Elements> */}
      <Button
        onClick={(e) => {
          e.preventDefault();
          // save(stripe, elements);
        }}
        type="submit"
        variant="contained"
        color="secondary"
        fullWidth
        // disabled={!stripe || savePaymemtMethodLoadng}
      >
        Add payment details
      </Button>
    </>
  ) : null;
}

