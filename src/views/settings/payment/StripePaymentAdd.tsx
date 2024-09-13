import { Button, Card } from '@mui/material';
import { CardElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Stripe, StripeCardElement } from '@stripe/stripe-js';

type PaymentMethodProps = {
  save: (stripe: Stripe | null, elements: StripeCardElement | null) => void;
  savePaymemtMethodLoadng?: boolean;
};

export const StripePaymentAdd = ({ save, savePaymemtMethodLoadng }: PaymentMethodProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const cardElement = elements?.getElement(CardElement);
  console.log('cardElement =====>', cardElement);
  
  return (
    <>
      <PaymentElement />
      <Button
        onClick={(e) => {
          e.preventDefault();
          save(stripe, cardElement!);
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
