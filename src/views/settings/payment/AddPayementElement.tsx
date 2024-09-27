import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { StripePaymentAdd } from './StripePaymentAdd';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || '');

export default function AddPaymentElement({
  addPayment,
  savePayLoading,
  clientSecret
}: {
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
