import { Button } from '@mui/material';
import {PaymentElement} from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  return (
    <form>
      <PaymentElement />
      <Button
        onClick={(e) => {
          e.preventDefault();
          // save(stripe, elements);
        }}
        type="submit"
        variant="contained"
        color="secondary"
        fullWidth
        // disabled={!stripe || savePaymemtMethodLoadng}
      >
        Add payment details
      </Button>
    </form>
  );
};

export default CheckoutForm;