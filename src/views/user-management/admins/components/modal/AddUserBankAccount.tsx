import React, { Dispatch, SetStateAction } from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Stack, TextField } from '@mui/material';
import { Formik } from 'formik';
import { LoadingButton } from '@mui/lab';
import { useMutation } from '@apollo/client';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import GenericModal from 'ui-component/modal/GenericModal';
import { ADD_USER_BANK_ACCOUNT_FROM_DETAIL } from '../business-management/graphql/mutations';
import { accountHolderTypeSelect, accountTypeSelect, addBankAccountValidationSchema } from '../constant';

type AddUserBankAccountModalType = {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  refetch: () => void;
};

export default function AddUserBankAccountModal({ openModal, setOpenModal, refetch }: AddUserBankAccountModalType) {
  const initialValues = {
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    accountHolderType: '',
    accountType: ''
  };
  const [handleAddBankAccount, { loading }] = useMutation(ADD_USER_BANK_ACCOUNT_FROM_DETAIL);
  const { successSnack, errorSnack } = useSuccErrSnack();

  const handleFormSubmit = async (values: any) => {
    try {
      const response = await handleAddBankAccount({
        variables: {
          body: {
            accountName: values.accountName,
            accountNumber: values.accountNumber,
            routingNumber: values.routingNumber,
            accountHolderType: values.accountHolderType,
            accountType: values.accountType
          }
        }
      });
      successSnack(response?.data?.addUserBankAccountFromDetail?.message);
      setOpenModal(false);
      refetch();
    } catch (err: any) {
      errorSnack(err?.message);
      setOpenModal(false);
    }
  };
  return (
    <GenericModal openModal={openModal} closeModal={() => setOpenModal(false)} title={'Add bank account'}>
      <Formik initialValues={initialValues} validationSchema={addBankAccountValidationSchema} onSubmit={handleFormSubmit}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            {/* <Stack rowGap={3}>
              <FormControl fullWidth>
                <InputLabel>{'Account Name'}</InputLabel>
                <TextField
                  fullWidth
                  name="accountName"
                  value={values.accountName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Account name"
                />
                {touched.accountName && errors.accountName && (
                  <FormHelperText error id="standard-weight-helper-text--register">
                    {errors.accountName}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>{'Account Number'}</InputLabel>
                <TextField
                  fullWidth
                  name="accountNumber"
                  value={values.accountNumber}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="00000000"
                />
                {touched.accountNumber && errors.accountNumber && (
                  <FormHelperText error id="standard-weight-helper-text--register">
                    {errors.accountNumber}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>{'BSB'}</InputLabel>
                <TextField
                  fullWidth
                  name="routingNumber"
                  value={values.routingNumber}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="000000"
                />
                {touched.routingNumber && errors.routingNumber && (
                  <FormHelperText error id="standard-weight-helper-text--register">
                    {errors.routingNumber}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>{'Account holder type'}</InputLabel>
                <TextField
                  fullWidth
                  name="accountHolderType"
                  value={values.accountHolderType}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Account holder type"
                  select
                >
                  {accountHolderTypeSelect.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                {touched.accountHolderType && errors.accountHolderType && (
                  <FormHelperText error id="accountHolderType">
                    {errors.accountHolderType}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>{'Account type'}</InputLabel>
                <TextField
                  fullWidth
                  name="accountType"
                  value={values.accountType}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Account holder type"
                  select
                >
                  {accountTypeSelect.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                {touched.accountType && errors.accountType && (
                  <FormHelperText error id="accountType">
                    {errors.accountType}
                  </FormHelperText>
                )}
              </FormControl>
              <LoadingButton type="submit" loading={loading} variant="contained" disabled={loading} size="large">
                Save changes
              </LoadingButton>
            </Stack> */}
          </form>
        )}
      </Formik>
    </GenericModal>
  );
}
