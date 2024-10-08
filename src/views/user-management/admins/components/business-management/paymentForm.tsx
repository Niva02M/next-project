import { useState } from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import { useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = ({ clientSecret }: { clientSecret: string }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: 'Jenny Rosen'
          }
        }

        // elements,
        // confirmParams: {
        //     // Make sure to change this to your payment completion page
        //     return_url: `${window.location.origin}/dashboard`
        // }
      });
      if (error?.type === 'card_error' || error?.type === 'validation_error') {
        setMessage(String(error.message));
      } else {
        setMessage('An unexpected error occured.');
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error, 'error');
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <CardElement id="card-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">{isLoading ? <div className="spinner" id="spinner"></div> : 'Pay now'}</span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default PaymentForm;
