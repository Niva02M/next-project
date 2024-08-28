import { Button } from '@mui/material';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Stripe, StripeElements } from '@stripe/stripe-js';

type PaymentMethodProps = {
  save: (stripe: Stripe | null, elements: StripeElements | null) => void;
  savePaymemtMethodLoadng?: boolean;
};

export const StripePaymentAdd = ({ save, savePaymemtMethodLoadng }: PaymentMethodProps) => {
  const stripe = useStripe();
  const elements = useElements();
  return (
    <>
      <PaymentElement />
      <Button
        onClick={(e) => {
          e.preventDefault();
          save(stripe, elements);
        }}
        type="submit"
        variant="contained"
        color="secondary"
        fullWidth
        disabled={!stripe || savePaymemtMethodLoadng}
        sx={{ mt: 2 }}
      >
        Add payment details
      </Button>
    </>
  );
};
