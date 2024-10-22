import { Box, Button, Chip, CircularProgress, FormControlLabel, InputLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import { PayoutDetailWrapper } from './Payout.styles';
import {
  DELETE_BUSINESS_USER_DESCRIPTION,
  DELETE_BUSINESS_USER_TITLE,
  DELETE_USER_BANK_ACCOUNT_DESCRIPTION,
  DELETE_USER_BANK_ACCOUNT_TITLE,
  PAYOUT_DETAILS,
  externalAccounts,
  payOutDetials,
  verificationStatus
} from '../constant';
import { useMutation } from '@apollo/client';
import { DELETE_STRIPE_CONNECT_ACCOUNT, DELETE_USER_BANK_ACCOUNT } from './graphql/mutations';
import GenericModal from 'ui-component/modal/GenericModal';
import { useState } from 'react';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import AlignCenter from 'components/align-center/AlignCenter';

export default function PayoutCard({ detail, refetch }: { detail: any; refetch: () => void }) {
  const [openModal, setOpenModal] = useState(false);
  const [openModalDeleteConnectAccount, setOpenModalDeleteConnectAccount] = useState(false);
  const [openModalDeleteBankAccount, setOpenModalDeleteBankAccount] = useState(false);
  const [selectBankId, setSelectBankId] = useState('');
  const { successSnack, errorSnack } = useSuccErrSnack();
  const [handleDeleteStripeConnectAccount, { loading: connectAccountLoading }] = useMutation(DELETE_STRIPE_CONNECT_ACCOUNT);
  const [handleDeleteBankAccount, { loading: bankAccountLoading }] = useMutation(DELETE_USER_BANK_ACCOUNT);

  const deleteConnectAccount = async () => {
    try {
      const response = await handleDeleteStripeConnectAccount({
        variables: {
          connectAccountId: detail?.accountId
        }
      });
      setOpenModalDeleteConnectAccount(false);
      successSnack(response?.data?.deleteStripeConnectAccount?.message);
      refetch();
    } catch (error: any) {
      setOpenModalDeleteConnectAccount(false);
      errorSnack(error.message);
    }
  };

  const handleRemoveBankAccount = async () => {
    try {
      const response = await handleDeleteBankAccount({
        variables: {
          bankId: selectBankId
        }
      });
      setOpenModalDeleteBankAccount(false);
      successSnack(response?.data?.deleteUserBankAccount?.message);
      refetch();
    } catch (error: any) {
      setOpenModalDeleteBankAccount(false);
      errorSnack(error.message);
    }
  };

  return (
    <>
      <Stack mb={3}>
        <Stack flexDirection="row" alignItems="flex-start" justifyContent="space-between" sx={{ gap: 2, mb: 2 }}>
          <Typography variant="h3">{PAYOUT_DETAILS}</Typography>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => {
              setOpenModalDeleteConnectAccount(true);
            }}
          >
            Remove
          </Button>
        </Stack>
        <Stack
          flex={1}
          sx={{
            gap: 0.5,
            '.MuiTypography-root': {
              flex: 1
            }
          }}
        >
          <Typography>
            {payOutDetials.ACCOUNT_ID}: {detail?.accountId}
          </Typography>
          <Typography>
            {payOutDetials.ACCOUNT_STATUS}: {detail?.accountStatus}
          </Typography>
          <Typography>
            {payOutDetials.ACCOUNT_TYPE}: {detail?.accountType}
          </Typography>
          <Typography>
            {payOutDetials.VERIFICATION_STATUS}:&nbsp;
            <Chip
              label={detail?.verificationStatus}
              color={detail?.verificationStatus === verificationStatus.PENDING ? 'success' : 'error'}
              size="small"
              sx={{ textTransform: 'capitalize' }}
            />
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="h4" mb={2}>
        External accounts
      </Typography>
      <RadioGroup
        aria-labelledby="payout-radio-buttons-group-label"
        name="payout-radio-buttons-group"
        sx={{
          gap: 2,
          overflow: 'auto',
          mb: 2
        }}
      >
        {detail?.externalAccounts?.map((bankDetail: any) => (
          <PayoutDetailWrapper key={bankDetail?.id}>
            <FormControlLabel
              // value={item.id}
              checked={detail?.externalAccounts?.default_for_currency}
              control={<Radio />}
              onChange={() => {
                setSelectBankId(bankDetail?.id);
                // setOpenModalDefaultCard(true);
              }}
              sx={{
                '.MuiFormControlLabel-label': {
                  width: '100%'
                }
              }}
              label={
                <Stack
                  flexDirection="row"
                  flex={1}
                  alignItems="center"
                  sx={{
                    '.MuiTypography-root': {
                      flex: 1
                    }
                  }}
                >
                  <Typography>{bankDetail?.account_holder_name}</Typography>
                  <Typography>
                    {externalAccounts.ACCOUNT_NUMBER}: *****{bankDetail?.last4}
                  </Typography>
                  <Typography>
                    {externalAccounts.BSB}: {bankDetail?.routing_number}
                  </Typography>
                  <Typography>
                    {externalAccounts.STATUS}:&nbsp;
                    <Chip
                      label={bankDetail?.status}
                      color={bankDetail?.status === 'new' ? 'success' : 'error'}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Typography>
                </Stack>
              }
            />
            {detail?.externalAccounts.length > 1 && (
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  setOpenModalDeleteBankAccount(true);
                  setSelectBankId(bankDetail?.id);
                }}
              >
                Remove
              </Button>
            )}
          </PayoutDetailWrapper>
        ))}
      </RadioGroup>
      <Button variant="text" sx={{ p: 0 }} onClick={() => setOpenModal(true)}>
        Add payout details
      </Button>

      {/* Add user bank account */}
      <GenericModal openModal={openModal} closeModal={() => setOpenModal(false)} title={'Add bank account'}>
        <InputLabel>Account Name</InputLabel>
        <TextField type="text" />
        {/* {setupIntentLoading && (
          <AlignCenter>
            <CircularProgress />
          </AlignCenter>
        )} */}
        {/* Stripe card ui */}
        {/* {!setupIntentLoading && kind === 'card' && secret && (
          <AddPaymentElement addPayment={addPayment} savePayLoading={savePayLoading} clientSecret={secret} />
        )} */}
        {/* Stripe bank ui */}
        {/* {!setupIntentLoading && kind === 'au_bank' && secret && (
          <AddPaymentElement addPayment={addPayment} savePayLoading={savePayLoading} clientSecret={secret} />
        )} */}
      </GenericModal>
      {/* Remove business user card */}
      <GenericModal
        openModal={openModalDeleteConnectAccount}
        btnDirection="row"
        btnTextYes="Yes"
        btnTextNo="No"
        handleYes={() => deleteConnectAccount()}
        closeModal={() => setOpenModalDeleteConnectAccount(false)}
        title={DELETE_BUSINESS_USER_TITLE}
        maxWidth={620}
        isLoading={connectAccountLoading}
      >
        <Typography>{DELETE_BUSINESS_USER_DESCRIPTION}</Typography>
      </GenericModal>

      {/* Remove bank account */}
      <GenericModal
        openModal={openModalDeleteBankAccount}
        btnDirection="row"
        btnTextYes="Yes"
        btnTextNo="No"
        handleYes={() => handleRemoveBankAccount()}
        closeModal={() => setOpenModalDeleteBankAccount(false)}
        title={DELETE_USER_BANK_ACCOUNT_TITLE}
        maxWidth={620}
        isLoading={bankAccountLoading}
      >
        <Typography>{DELETE_USER_BANK_ACCOUNT_DESCRIPTION}</Typography>
      </GenericModal>
    </>
  );
}
