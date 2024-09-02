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
// import { AddPaymentElement } from './AddPayemntElement';

export default function Subscription() {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [kind, setKind] = useState('card');
  const openLogoutModal = () => {
    setOpenModal(true);
  };

  const radioOptions = [
    {
      id: 1,
      value: 'subcritpion',
      image: Visa,
      cardName: 'Subcription card',
      cardLastFourDigit: '4242',
      cardExpireDate: `${new Date()}`
    },
    {
      id: 2,
      value: 'visa',
      image: Visa,
      cardName: 'Visa card',
      cardLastFourDigit: '2424',
      cardExpireDate: `${new Date()}`
    },
    {
      id: 3,
      value: 'master',
      image: Visa,
      cardName: 'Master card',
      cardLastFourDigit: '1111',
      cardExpireDate: `${new Date()}`
    }
  ];

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
                    <Typography>{item.cardName}</Typography>
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
          {/* <PaymentDetailWrapper>
            <FormControlLabel
              value="visa"
              control={<Radio />}
              label={
                <Stack>
                  <Image src={Visa} alt="card-image"></Image>
                  <Typography>Subscription card</Typography>
                  <Divider orientation="vertical" sx={{ height: 20 }} />
                  <Typography>**** **** **** 4242</Typography>
                  <Typography>Exp 12/26</Typography>
                </Stack>
              }
            />
            <IconButton>
              <Close />
            </IconButton>
          </PaymentDetailWrapper> */}
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
        <Box>
          <InputLabel>Payment type</InputLabel>
          <Select
            fullWidth
            IconComponent={ExpandMoreOutlinedIcon}
            name="kind"
            value={kind}
            onChange={(event) => {
              console.log(event.target.value, 'sdf');
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
        {kind === 'card' && (
          <AddPaymentElement kind={kind} />
          // <AddPaymentElement
          //   clientSecret={clientSecretCard}
          //   businessConnectId={props.businessConnectId || null}
          //   addPayment={addPayment}
          //   savePaymemtMethodLoadng={savePaymemtMethodLoadng}
          // />
        )}

        {kind === 'au_bank' && (
          <AddPaymentElement kind={kind} />
          // <AddPaymentElement
          //   clientSecret={clientSecretBank}
          //   businessConnectId={props.businessConnectId || null}
          //   addPayment={addPayment}
          //   savePaymemtMethodLoadng={savePaymemtMethodLoadng}
          // />
        )}
      </GenericModal>
    </>
  );
}
