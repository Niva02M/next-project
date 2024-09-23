import { Close } from '@mui/icons-material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import {
  Box,
  Button,
  CircularProgress,
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
import React, { useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import AddPaymentElement from './AddPayementElement';
import GenericModal from 'ui-component/modal/GenericModal';
import { PaymentDetailWrapper } from './Payment.styles';
import { GET_PAYMENT_METHODS } from './graphql/queries';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_CARD_DEFAULT_MUTATION, MAKE_CARD_DEFAULT_MUTATION, SAVE_PAYMENT_METHOD } from './graphql/mutation';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import AlignCenter from 'components/align-center/AlignCenter';
import Visa from 'assets/payment/visa';
import Master from 'assets/payment/master';
import Amex from 'assets/payment/amex';
import Jcb from 'assets/payment/jcb';
import Unionpay from 'assets/payment/unionpay';
import Bank from 'assets/payment/bank';
import Base from 'assets/payment/base';
import { Stripe, StripeElements } from '@stripe/stripe-js';
import {
  ADD_PAYMENT_DETAIL,
  ADD_PAYMENT_DETAILS,
  DEFAULT_CARD_DESCRIPTION,
  DEFAULT_CARD_TITLE,
  DELETE_CARD,
  DELETE_CARD_MESSAGE,
  PAYMENT_DETAILS,
  PAYMENT_TYPE,
  SUBSCRIPTION_SETTINGS
} from '../constant';
import { useSession } from 'next-auth/react';

const RenderCard = ({ card }: { card: string }) => {
  switch (card) {
    case 'visa':
      return <Visa />;

    case 'mastercard':
      return <Master />;

    case 'amex':
      return <Amex />;

    case 'jcb':
      return <Jcb />;

    case 'unionpay':
      return <Unionpay />;

    case 'au_becs_debit':
      return <Bank />;

    default:
      return <Base />;
  }
};

export default function Payment() {
  const methodBank = 'au_becs_debit';
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState('');
  const { successSnack, errorSnack } = useSuccErrSnack();
  const [kind, setKind] = useState('card');
  const [openDeleteCard, setOpenDeleteCard] = useState(true);
  const [openModalDeleteCard, setOpenModalDeleteCard] = useState(false);
  const [openDefaultCard, setOpenDefaultCard] = useState(true);
  const [openModalDefaultCard, setOpenModalDefaultCard] = useState(false);
  const [defaultPayment, setDefaultPayment] = useState<string | null>(null);

  const openAddPaymentModal = () => {
    setOpenModal(true);
  };

  const { data, loading, refetch } = useQuery(GET_PAYMENT_METHODS);
  const [handleDeleteCard, { loading: deleteCardLoading }] = useMutation(DELETE_CARD_DEFAULT_MUTATION);
  const [handleSavePayment, { loading: savePayLoading }] = useMutation(SAVE_PAYMENT_METHOD);
  const [handleDefaultCard] = useMutation(MAKE_CARD_DEFAULT_MUTATION);

  const handleDelete = async (id: string) => {
    try {
      const response = await handleDeleteCard({ variables: { body: { paymentMethodId: id } } });
      refetch();
      successSnack(response?.data?.deleteCard?.message);
      setOpenModalDeleteCard(false);
    } catch (err: any) {
      errorSnack(err.message);
      setOpenModalDeleteCard(false);
    }
  };

  useEffect(() => {
    if (data?.getMyPaymentMethods) {
      const defaultMethod = data?.getMyPaymentMethods?.defaultMethod;
      setDefaultPayment(defaultMethod);
    }
  }, [data]);

  const makeDefaultPayment = async () => {
    try {
      await handleDefaultCard({
        variables: {
          body: {
            paymentMethodId: selected
          }
        }
      });
      setDefaultPayment(selected);
      successSnack('default-payment-method');
      setOpenModalDefaultCard(false);
    } catch (e: any) {
      successSnack(e.message);
    }
  };

  const addPayment = async (stripe: Stripe, elements: StripeElements) => {
    if (!stripe || !elements) {
      return;
    }
    try {
      const result = await stripe.confirmSetup({
        elements: elements,
        redirect: 'if_required',
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: 'Visa card'
            }
          }
        }
      });

      if (result.error) {
        errorSnack(result?.error?.message!);
      } else {
        // save payment to local db
        await handleSavePayment({
          variables: {
            input: {
              paymentMethod: result?.setupIntent?.payment_method,
              //@ts-ignore
              userId: session.data?.user?.user?._id!
            }
          }
        });
        successSnack('add-new-payment-mehtod');
      }
      refetch();
      setOpenModal(false);
    } catch (e: any) {
      errorSnack(e?.message!);
    }
  };

  return (
    <>
      <MainCard>
        <Typography variant="h2">{SUBSCRIPTION_SETTINGS}</Typography>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h3" mb={2}>
          {PAYMENT_DETAILS}
        </Typography>
        {loading ? (
          <AlignCenter>
            <CircularProgress />
          </AlignCenter>
        ) : (
          <>
            <RadioGroup
              aria-labelledby="payment-card-radio-buttons-group-label"
              name="payment-radio-buttons-group"
              sx={{
                gap: 2,
                overflow: 'auto',
                mb: 2
              }}
            >
              {data?.getMyPaymentMethods?.paymentMethods.map((item: any) => (
                <PaymentDetailWrapper key={item.id}>
                  <FormControlLabel
                    value={item.id}
                    checked={defaultPayment === item.id ? true : false}
                    control={<Radio />}
                    onChange={() => {
                      setSelected(item.id);
                      setOpenModalDefaultCard(true);
                    }}
                    label={
                      <Stack>
                        <RenderCard card={item.method.paymentMethod} />
                        <Divider orientation="vertical" sx={{ height: 20 }} />
                        <Typography>**** **** **** {item.method.last4}</Typography>
                        {item.method.paymentMethod != methodBank && (
                          <Typography>{`Exp ${item.method.exp_month}/${item.method.exp_year}`}</Typography>
                        )}
                      </Stack>
                    }
                  />
                  {data?.getMyPaymentMethods?.paymentMethods.length > 0 && (
                    <IconButton
                      onClick={() => {
                        setOpenModalDeleteCard(true);
                        setSelected(item.id);
                      }}
                    >
                      <Close />
                    </IconButton>
                  )}
                </PaymentDetailWrapper>
              ))}
            </RadioGroup>
            {data?.getMyPaymentMethods?.paymentMethods.length > 0 && (
              <Button variant="text" sx={{ p: 0, mt: 2 }} onClick={openAddPaymentModal}>
                {ADD_PAYMENT_DETAIL}
              </Button>
            )}
          </>
        )}
        {data?.getMyPaymentMethods?.paymentMethods.length === 0 && (
          <Button variant="contained" onClick={openAddPaymentModal}>
            {ADD_PAYMENT_DETAIL}
          </Button>
        )}
      </MainCard>
      {/* Add new payment */}
      <GenericModal
        open={open}
        setOpen={setOpen}
        openModal={openModal}
        closeModal={(close: any) => {
          if (close) {
            setOpenModal(false);
          }
        }}
        title={ADD_PAYMENT_DETAILS}
      >
        <Box mb={2.5}>
          <InputLabel>{PAYMENT_TYPE}</InputLabel>
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
        {kind === 'card' && <AddPaymentElement addPayment={addPayment} kind={kind} savePayLoading={savePayLoading} />}

        {kind === 'au_bank' && <AddPaymentElement addPayment={addPayment} kind={kind} savePayLoading={savePayLoading} />}
      </GenericModal>

      {/* Delete card */}
      <GenericModal
        open={openDeleteCard}
        setOpen={setOpenDeleteCard}
        openModal={openModalDeleteCard}
        btnDirection="row"
        btnTextYes="Yes"
        btnTextNo="No"
        handleYes={() => handleDelete(selected)}
        closeModal={(close: any) => {
          if (close) {
            setOpenModalDeleteCard(false);
          }
        }}
        title={DELETE_CARD}
        maxWidth={620}
        isLoading={deleteCardLoading}
      >
        <Typography>{DELETE_CARD_MESSAGE}</Typography>
      </GenericModal>

      {/* Default card */}
      <GenericModal
        open={openDefaultCard}
        setOpen={setOpenDefaultCard}
        openModal={openModalDefaultCard}
        btnDirection="row"
        btnTextYes="Yes"
        btnTextNo="No"
        handleYes={() => makeDefaultPayment()}
        closeModal={(close: any) => {
          if (close) {
            setOpenModalDefaultCard(false);
          }
        }}
        title={DEFAULT_CARD_TITLE}
        maxWidth={620}
        isLoading={deleteCardLoading}
      >
        <Typography>{DEFAULT_CARD_DESCRIPTION}</Typography>
      </GenericModal>
    </>
  );
}
