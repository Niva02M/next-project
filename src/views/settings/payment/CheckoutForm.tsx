// components/CheckoutForm.js
import { useState } from 'react';
import { CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@mui/material';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
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

    // if (error) {
    //   setError(error.message);
    //   setLoading(false);
    // } else {
    //   setError(null);
    //   console.log('Payment Method:', paymentMethod);
    //   // Send the paymentMethod.id to your server for processing
    //   // fetch('/api/payment', { method: 'POST', body: JSON.stringify({ paymentMethod }) })
    // }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {/* <PaymentElement /> */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Button type="submit" variant="contained" color="secondary" fullWidth disabled={!stripe || loading} sx={{ mt: 2 }}>
        Add payment details
      </Button>
      {/* <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Submit Payment'}
      </button> */}
    </form>
  );
};

export default CheckoutForm;
