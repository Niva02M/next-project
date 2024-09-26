import React from 'react';
import { RadioGroup, FormControlLabel, Stack, IconButton, Typography, Divider, Radio } from '@mui/material';
import { Close } from '@mui/icons-material';
import { PaymentDetailWrapper } from './Payment.styles';
import { RenderCard } from '../constant';

interface PaymentMethodsListProps {
  paymentMethods: any[];
  defaultPayment: string | null;
  setSelected: (id: string) => void;
  setOpenModalDeleteCard: (open: boolean) => void;
  setOpenModalDefaultCard: (open: boolean) => void;
}

const PaymentMethodsList = ({
  paymentMethods,
  defaultPayment,
  setSelected,
  setOpenModalDeleteCard,
  setOpenModalDefaultCard,
}: PaymentMethodsListProps) => (
  <RadioGroup
    aria-labelledby="payment-card-radio-buttons-group-label"
    name="payment-radio-buttons-group"
    sx={{
      gap: 2,
      overflow: 'auto',
      mb: 2,
    }}
  >
    {paymentMethods.map((item) => (
      <PaymentDetailWrapper key={item.id}>
        <FormControlLabel
          value={item.id}
          checked={defaultPayment === item.id}
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
              {item.method.paymentMethod !== 'au_becs_debit' && (
                <Typography>{`Exp ${item.method.exp_month}/${item.method.exp_year}`}</Typography>
              )}
            </Stack>
          }
        />
        {paymentMethods.length > 1 && (
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
);

export default PaymentMethodsList;
