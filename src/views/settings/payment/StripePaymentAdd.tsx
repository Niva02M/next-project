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
      <Button
        onClick={async (e) => {
          e.preventDefault();
          save(stripe!, elements!);
        }}
        type="submit"
        variant="contained"
        color="secondary"
        fullWidth
        disabled={!stripe || savePaymemtMethodLoading}
        sx={{ mt: 2 }}
      >
        Add payment details
      </Button>
    </>
  );
};
