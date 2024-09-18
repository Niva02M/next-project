import { useMutation } from '@apollo/client';
import { Box, Button } from '@mui/material';
import { CardElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Stripe, StripeCardElement } from '@stripe/stripe-js';
import { SAVE_PAYMENT_METHOD } from './graphql/mutation';

type PaymentMethodProps = {
  save: (stripe: Stripe | null, elements: StripeCardElement | null) => void;
  savePaymemtMethodLoadng?: boolean;
};

export const StripePaymentAdd = ({ save, savePaymemtMethodLoadng }: PaymentMethodProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [handleSavePayment] = useMutation(SAVE_PAYMENT_METHOD);

  // const cardElementOptions = {
  //   style: {
  //     base: {
  //       fontSize: '16px',
  //       color: '#32325d',
  //       fontFamily: 'Poppins, Helvetica, sans-serif',
  //       fontSmoothing: 'antialiased',
  //       '::placeholder': {
  //         color: '#aab7c4'
  //       }
  //     },
  //     invalid: {
  //       color: '#fa755a',
  //       iconColor: '#fa755a'
  //     },
  //     complete: {
  //       color: '#4caf50' // You can even style the field when the input is complete
  //     }
  //   },
  //   hidePostalCode: true
  // };

  return (
    <>
      <PaymentElement />
      {/* <CardElement options={cardElementOptions} /> */}
      <Button
        onClick={async (e) => {
          e.preventDefault();
          if (!stripe || !elements) {
            return;
          }

          const cardElement = elements?.getElement(CardElement);
          if (!cardElement) {
            return;
          }

          const result = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement
          });

          console.log('result ===>', result);

          await handleSavePayment({
            variables: {
              input: {
                paymentMethod: result?.paymentMethod?.id,
                userId: '66974c6f3988836dc89ea085' //make it dynamic later
              }
            }
          });

          // save(stripe, cardElement!);
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
