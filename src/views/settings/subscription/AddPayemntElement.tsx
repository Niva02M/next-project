import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { Button, Typography } from '@mui/material';
import { GET_EPHEMERAL_KEY_QUERY } from './graphql/queries';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  'pk_test_51Mc0MNEr2SjM3rR4LaEDHNLk03VqGvBNMIOOQ4Khtyo2gS5mJp0nMAiVPPeianRFTJcXiPVJZitbibx2KJQU73r500F7Rpyih7'
);

export default function AddPaymentElement({ kind }: { kind: string }) {
  const { data } = useQuery(GET_EPHEMERAL_KEY_QUERY);
  useEffect(() => {
    console.log('clientSecert ====>', data);
  });
  const options = {
    // passing the client secret obtained from the server
    // clientSecret: '{{sk_test_51PsHKgB6OyBxjtx8ROh460J7rXivp8PIHUhdQVCc8A33IXQzcy1uQtyjETuey5UeeajlG19uBy1nrpvbr6qI1pnP00wOxBf4sy}}'
  };

  return (
    // <Elements stripe={stripePromise} options={options}>
    //   <CheckoutForm />
    // </Elements>
    <>
      <Typography variant={'h6'}>{kind}</Typography>
      <Button
        onClick={(e) => {
          e.preventDefault();
          //   save(stripe, elements);
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
  );
}
