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
import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import AddPaymentElement from './AddPayementElement';
import GenericModal from 'ui-component/modal/GenericModal';
import { PaymentDetailWrapper } from './Payment.styles';
import { GET_PAYMENT_METHODS } from './graphql/queries';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_CARD_DEFAULT_MUTATION, MAKE_CARD_DEFAULT_MUTATION } from './graphql/mutation';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import AlignCenter from 'components/align-center/AlignCenter';

export default function Subscription() {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  // const [openDeleteCard, setOpenDeleteCard] = useState(true);
  // const [openModalDeleteCard, setOpenModalDeleteCard] = useState(false);

  const [kind, setKind] = useState('card');
  const { successSnack, errorSnack } = useSuccErrSnack();
  // const dispatch = useDispatch();
  const openAddPaymentModal = () => {
    setOpenModal(true);
  };

  // const openDeletePaymentModal = () => {
  //   console.log('clicked', openDeleteCard);
  //   setOpenDeleteCard(true);
  // };

  const { data, loading, refetch } = useQuery(GET_PAYMENT_METHODS);
  const [handleDeleteCard] = useMutation(DELETE_CARD_DEFAULT_MUTATION);
  const [handleDefaultCard] = useMutation(MAKE_CARD_DEFAULT_MUTATION);

  const handleDelete = async (id: string) => {
    try {
      const response = await handleDeleteCard({ variables: { body: { paymentMethodId: id } } });
      refetch();
      successSnack(response?.data?.deleteCard?.message);
      // setOpenModalDeleteCard(false);
    } catch (err: any) {
      errorSnack(err.message);
      // setOpenModalDeleteCard(false);
    }
  }

  const addPayment = () => {
    console.log('add payment clicked'); 
    setOpenModal(false);
  }

  return (
    <>
      <MainCard>
        <Typography variant="h2">Subscription settings</Typography>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h3" mb={2}>
          Payment details
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
                    control={<Radio />}
                    label={
                      <Stack>
                        <Typography>{item.method.paymentMethod}</Typography>
                        <Divider orientation="vertical" sx={{ height: 20 }} />
                        <Typography>**** **** **** {item.method.last4}</Typography>
                        <Typography>{`Exp ${item.method.exp_month}/${item.method.exp_year}`}</Typography>
                      </Stack>
                    }
                  />
                  <IconButton onClick={() => handleDelete(item.id)}>
                    <Close />
                  </IconButton>
                </PaymentDetailWrapper>
              ))}
            </RadioGroup>
            <Button variant="text" sx={{ p: 0, mt: 2 }} onClick={openAddPaymentModal}>
              Add new payment detail
            </Button>
          </>
        )}
        {/* {console.log(data?.getCards.length)} */}
        {data?.getMyPaymentMethods?.paymentMethods.length === 0 && (
          <Button variant="contained" sx={{ mt: 2 }} onClick={openAddPaymentModal}>
            Add new payment detail
          </Button>
        )}
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
        {kind === 'card' && <AddPaymentElement addPayment={addPayment} kind={kind} savePaymentLoading={false} />}

        {kind === 'au_bank' && <AddPaymentElement addPayment={addPayment} kind={kind} savePaymentLoading={false} />}
      </GenericModal>
      {/* Delete card */}
      {/* <GenericModal
        open={openDeleteCard}
        setOpen={setOpenDeleteCard}
        openModal={openModalDeleteCard}
        closeModal={(close: any) => {
          if (close) {
            // setOpenModalDeleteCard(false);
          }
        }}
        title="Delete card"
      >
        <Typography>Are you sure you want to delete card?</Typography>
      </GenericModal> */}
    </>
  );
}
