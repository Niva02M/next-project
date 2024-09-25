import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// material-ui
import { CircularProgress, Grid } from '@mui/material';

// assets
// import Spinner from 'components/spinner';
// import useSnackbar from 'hooks/common/useSnackbar';

// grapqhl
import { CREATE_PAYMENT_INTENT } from './graphql/mutations';
import PaymentForm from './paymentForm';
import MainCard from 'ui-component/cards/MainCard';


const stripePromise = loadStripe(
    'pk_test_51Mc0MNEr2SjM3rR4LaEDHNLk03VqGvBNMIOOQ4Khtyo2gS5mJp0nMAiVPPeianRFTJcXiPVJZitbibx2KJQU73r500F7Rpyih7'
);

// ==============================|| CREATE PAYMENT ||============================== //

const CreatePaymentPage = () => {
    const [pageLoading, setPageLoading] = useState(false);


    const [clientSecret, setClientSecret] = useState('');
    const [amount, setAmount] = useState(0);

    const [handlePaymentIntent, { data, error }] = useMutation(CREATE_PAYMENT_INTENT);

    useEffect(() => {
        if (data?.createPaymentIntent) {
            setClientSecret(data?.createPaymentIntent?.clientSecret);
        }
    }, [data]);

    const handleProceed = () => {
        console.log(amount);
        handlePaymentIntent({
            variables: {
                input: {
                    amount: Number(amount)
                }
            }
        });
    };

    const onChangeInput = (e:any) => {
        setAmount(e.target.value);
    };


    return pageLoading ? (
        <CircularProgress />
    ) : (
        <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
            <Grid container justifyContent="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                <Grid item xs={6}>
                    <MainCard>
                        <input type="number" onChange={(e) => onChangeInput(e)} />
                        <button onClick={handleProceed}>Proceed</button>
                        {clientSecret && (
                            <Elements stripe={stripePromise} options={{ clientSecret, loader: 'auto' }}>
                                <PaymentForm clientSecret={clientSecret} />
                            </Elements>
                        )}
                    </MainCard>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CreatePaymentPage;
