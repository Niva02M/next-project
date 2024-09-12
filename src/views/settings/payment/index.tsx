import { Close } from '@mui/icons-material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Typography
} from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import MainCard from 'ui-component/cards/MainCard';
import Visa from 'assets/subscription/visa.svg';
import AddPaymentElement from './AddPayementElement';
import GenericModal from 'ui-component/modal/GenericModal';
import { PaymentDetailWrapper } from './Payment.styles';
import { Stripe, StripeElements } from '@stripe/stripe-js';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'react-redux';
import { CardElement, useElements } from '@stripe/react-stripe-js';

export default function Subscription() {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [kind, setKind] = useState('card');
  const dispatch = useDispatch();
  const openLogoutModal = () => {
    setOpenModal(true);
  };

  const radioOptions = [
    {
      id: 1,
      value: 'subcritpion',
      image: Visa,
      cardLastFourDigit: '4242',
      cardExpireDate: `${new Date()}`
    },
    {
      id: 2,
      value: 'visa',
      image: Visa,
      cardLastFourDigit: '2424',
      cardExpireDate: `${new Date()}`
    },
    {
      id: 3,
      value: 'master',
      image: Visa,
      cardLastFourDigit: '1111',
      cardExpireDate: `${new Date()}`
    }
  ];

  const addPayment = async (stripe: Stripe, elements: StripeElements) => {
    if (!stripe || !elements) {
      return;
    }
    try {
      const result = await stripe.confirmSetup({
        elements: elements,
        redirect: 'if_required'
        // confirmParams: {
        //     payment_method_data: {
        //         billing_details: {
        //             name: props.userId
        //                 ? `${clientDetail?.firstName} ${clientDetail?.lastName}`
        //                 : `${user?.firstName} ${user?.lastName}`
        //         }
        //     }
        // }
      });
      console.log('result', result);

    //   const cardElement = elements.getElement(result.elements);
  
    // const { token } = await stripe.createToken(cardElement!);

    // console.log('token =====>', token);

      if (result.error) {
        dispatch(
          openSnackbar({
            open: true,
            message: result?.error?.message,
            anchorOrigin: { horizontal: 'center' },
            variant: 'alert',
            alert: {
              color: 'error'
            }
          })
        );
      } else {
        // save payment to local db
        // await handleSavePayment({
        //     variables: {
        //         input: {
        //             paymentMethod: result?.setupIntent?.payment_method,
        //             // isClient: props.userId ? true : false,
        //             // ...(props.userId ? { userId: clientDetail._id } : {})
        //         }
        //     }
        // });
        // dispatch(
        //     openSnackbar({
        //         open: true,
        //         message: 'New payment method added.',
        //         anchorOrigin: { horizontal: 'center' },
        //         variant: 'alert',
        //         alert: {
        //             color: 'success'
        //         }
        //     })
        // );
        // await props.reloadData();
        // handleClose();
      }
    } catch (e: any) {
      dispatch(
        openSnackbar({
          open: true,
          message: e.message,
          anchorOrigin: { horizontal: 'center' },
          variant: 'alert',
          alert: {
            color: 'danger'
          }
        })
      );
    }
  };

  return (
    <>
      <MainCard>
        <Typography variant="h2">Subscription settings</Typography>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h3" mb={2}>
          Payment details
        </Typography>
        <RadioGroup
          aria-labelledby="payment-card-radio-buttons-group-label"
          name="payment-radio-buttons-group"
          sx={{
            gap: 2,
            overflow: 'auto',
            mb: 2
          }}
        >
          {radioOptions.map((item) => (
            <PaymentDetailWrapper key={item.id}>
              <FormControlLabel
                value={item.value}
                control={<Radio />}
                label={
                  <Stack>
                    <Image src={item.image} alt="card-image"></Image>
                    <Divider orientation="vertical" sx={{ height: 20 }} />
                    <Typography>**** **** **** {item.cardLastFourDigit}</Typography>
                    <Typography>Exp {dayjs(item.cardExpireDate).format('MM/YY')}</Typography>
                  </Stack>
                }
              />
              <IconButton>
                <Close />
              </IconButton>
            </PaymentDetailWrapper>
          ))}
        </RadioGroup>
        <Button variant="text" sx={{ p: 0, mt: 2 }} onClick={openLogoutModal}>
          Add new payment detail
        </Button>
      </MainCard>
      <GenericModal
        open={open}
        setOpen={setOpen}
        openModal={openModal}
        closeModal={(close: any) => {
          if (close) {
            setOpenModal(false);
          }
        }}
        title="Add payment details"
      >
        <Box mb={2.5}>
          <InputLabel>Payment type</InputLabel>
          <Select
            fullWidth
            IconComponent={ExpandMoreOutlinedIcon}
            name="kind"
            value={kind}
            onChange={(event) => {
              setKind(event.target.value);
            }}
          >
            {[
              { key: 'card', label: 'Card' },
              { key: 'au_bank', label: 'Bank' }
            ].map((item) => (
              <MenuItem key={item.key} value={item.key}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {kind === 'card' && <AddPaymentElement kind={kind} addPayment={addPayment} savePaymentLoading={false} />}

        {kind === 'au_bank' && <AddPaymentElement kind={kind} addPayment={addPayment} savePaymentLoading={false} />}
      </GenericModal>
    </>
  );
}
