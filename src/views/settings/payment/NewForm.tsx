// components/CheckoutForm.js
import { useState } from 'react';
import { CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@mui/material';

const NewForm = () => {
  const stripe = useStripe();
  const elements = useElements();
//   const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    console.log('elements ===>', elements);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement
    });

    console.log('result =====>', result);

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" variant="contained" color="secondary" fullWidth disabled={!stripe || loading} sx={{ mt: 2 }}>
        Add payment details
      </Button>
    </form>
  );
};

export default NewForm;
