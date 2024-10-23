import { Button, Chip, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { PayoutDetailWrapper } from './Payout.styles';
import {
  DELETE_BUSINESS_USER_DESCRIPTION,
  DELETE_BUSINESS_USER_TITLE,
  DELETE_USER_BANK_ACCOUNT_DESCRIPTION,
  DELETE_USER_BANK_ACCOUNT_TITLE,
  PAYOUT_DETAILS,
  UPDATE_DEFAULT_BANK_ACCOUNT_DESCRIPTION,
  UPDATE_DEFAULT_BANK_ACCOUNT_TITLE,
  externalAccounts,
  payOutDetials,
  verificationStatus
} from '../constant';
import { useMutation } from '@apollo/client';
import { DELETE_STRIPE_CONNECT_ACCOUNT, DELETE_USER_BANK_ACCOUNT, UPDATE_DEFAULT_BANK_ACCOUNT } from './graphql/mutations';
import GenericModal from 'ui-component/modal/GenericModal';
import { useState } from 'react';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import AddUserBankAccountModal from '../modal/AddUserBankAccount';

export default function PayoutCard({ detail, refetch }: { detail: any; refetch: () => void }) {
  const [openModal, setOpenModal] = useState(false);
  const [openModalDefaultBankAccount, setOpenModalDefaultBankAccount] = useState(false);
  const [openModalDeleteConnectAccount, setOpenModalDeleteConnectAccount] = useState(false);
  const [openModalDeleteBankAccount, setOpenModalDeleteBankAccount] = useState(false);
  const [selectBankId, setSelectBankId] = useState('');
  const { successSnack, errorSnack } = useSuccErrSnack();
  const [handleDeleteStripeConnectAccount, { loading: connectAccountLoading }] = useMutation(DELETE_STRIPE_CONNECT_ACCOUNT);
  const [handleDeleteBankAccount, { loading: bankAccountLoading }] = useMutation(DELETE_USER_BANK_ACCOUNT);
  const [handleUpdateBankAccount, { loading: updateBankAccountLoading }] = useMutation(UPDATE_DEFAULT_BANK_ACCOUNT);

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

  const updateBankAccount = async () => {
    try {
      const response = await handleUpdateBankAccount({
        variables: {
          bankId: selectBankId
        }
      });
      setOpenModalDefaultBankAccount(false);
      successSnack(response?.data?.updateDefaultBankAccount?.message);
      refetch();
    } catch (error: any) {
      setOpenModalDefaultBankAccount(false);
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
              value={bankDetail?.id}
              checked={bankDetail?.default_for_currency}
              control={<Radio />}
              onChange={() => {
                setSelectBankId(bankDetail?.id);
                setOpenModalDefaultBankAccount(true);
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
            {!bankDetail?.default_for_currency && (
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
      <AddUserBankAccountModal openModal={openModal} setOpenModal={setOpenModal} refetch={refetch} />

      {/* Update defualt card modal */}
      <GenericModal
        openModal={openModalDefaultBankAccount}
        btnDirection="row"
        btnTextYes="Yes"
        btnTextNo="No"
        handleYes={() => updateBankAccount()}
        closeModal={() => setOpenModalDefaultBankAccount(false)}
        title={UPDATE_DEFAULT_BANK_ACCOUNT_TITLE}
        maxWidth={620}
        isLoading={updateBankAccountLoading}
      >
        <Typography>{UPDATE_DEFAULT_BANK_ACCOUNT_DESCRIPTION}</Typography>
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
