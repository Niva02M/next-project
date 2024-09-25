import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Stripe, StripeElements } from '@stripe/stripe-js';

type PaymentMethodProps = {
  save: (stripe: Stripe, elements: StripeElements) => void;
  savePaymemtMethodLoading?: boolean;
};

export const StripePaymentAdd = ({ save, savePaymemtMethodLoading }: PaymentMethodProps) => {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <>
      <PaymentElement />
      <LoadingButton
        onClick={async (e) => {
          e.preventDefault();
          save(stripe!, elements!);
        }}
        loading={savePaymemtMethodLoading}
        disabled={!stripe || savePaymemtMethodLoading}
        variant="contained"
        size="large"
        type="submit"
        sx={{ mt: 2, display: 'flex', ml: 'auto' }}
      >
        Add payment details
      </LoadingButton>
    </>
  );
};
