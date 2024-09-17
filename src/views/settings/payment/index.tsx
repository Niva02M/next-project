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
import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import AddPaymentElement from './AddPayementElement';
import GenericModal from 'ui-component/modal/GenericModal';
import { PaymentDetailWrapper } from './Payment.styles';
import { GET_ALL_CARDS_QUERY } from './graphql/queries';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_CARD_DEFAULT_MUTATION } from './graphql/mutation';

export default function Subscription() {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [kind, setKind] = useState('card');
  // const dispatch = useDispatch();
  const openLogoutModal = () => {
    setOpenModal(true);
  };

  const { data } = useQuery(GET_ALL_CARDS_QUERY);
  const [selectCard, setSelectCard] = useState('');
  console.log('selectedCard =====>', selectCard)
  const [handleDeleteCard] = useMutation(DELETE_CARD_DEFAULT_MUTATION, {
    variables: {
      body: {
        cardId: selectCard
      }
    }
  });

  const addPayment = () => {}

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
          {data?.getCards.map((item: any, index: number) => (
            <PaymentDetailWrapper key={item.brand + index}>
              <FormControlLabel
                value={item.value}
                control={<Radio />}
                label={
                  <Stack>
                    {/* <Image src={item.image} alt="card-image"></Image> */}
                    <Typography>{item.brand}</Typography>
                    <Divider orientation="vertical" sx={{ height: 20 }} />
                    <Typography>**** **** **** {item.last4}</Typography>
                    <Typography>{`Exp ${item.exp_month}/${item.exp_year}`}</Typography>
                  </Stack>
                }
              />
              <IconButton
                onClick={() => {
                  console.log('delete card');
                  setSelectCard(item.userId);
                  handleDeleteCard;
                }}
              >
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
        {kind === 'card' && <AddPaymentElement addPayment={addPayment} kind={kind} savePaymentLoading={false} />}

        {kind === 'au_bank' && <AddPaymentElement addPayment={addPayment} kind={kind} savePaymentLoading={false} />}

        <div></div>
      </GenericModal>
    </>
  );
}
