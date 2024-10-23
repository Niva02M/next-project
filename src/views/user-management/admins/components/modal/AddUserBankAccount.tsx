import { FormControl, FormHelperText, InputLabel, Stack, TextField } from '@mui/material';
import { Formik } from 'formik';
import React, { Dispatch, SetStateAction } from 'react';
import GenericModal from 'ui-component/modal/GenericModal';
import { useMutation } from '@apollo/client';
import { CREATE_CUSTOM_STRIPE_ACCOUNT } from '../business-management/graphql/mutations';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';

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
    frontDocument: '',
    backDocument: ''
  };
  const [handleBankDetail, { loading }] = useMutation(CREATE_CUSTOM_STRIPE_ACCOUNT);
  const { successSnack, errorSnack } = useSuccErrSnack();

  const addBankValidation = Yup.object().shape({});

  const handleFormSubmit = async (values: any) => {
    try {
      const response = await handleBankDetail({
        variables: {
          body: {
            accountHolderType: 'INDIVIDUAL', //static field for now
            accountName: values.accountName,
            accountNumber: values.accountNumber,
            accountType: 'FUTSU', //static field for now
            identityDocumentBack: values.backDocument,
            identityDocumentFront: values.frontDocument,
            routingNumber: values.routingNumber
          }
        }
      });
      successSnack(response?.data?.createCustomStripeAccount?.message);
      setOpenModal(false);
      refetch();
    } catch (err: any) {
      errorSnack(err?.message);
      setOpenModal(false);
    }
  };
  return (
    <GenericModal openModal={openModal} closeModal={() => setOpenModal(false)} title={'Add bank account'}>
      <Formik initialValues={initialValues} validationSchema={addBankValidation} onSubmit={handleFormSubmit}>
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
            <Stack rowGap={3}>
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

              <LoadingButton type="submit" loading={loading} variant="contained" disabled={loading} size="large">
                Save changes
              </LoadingButton>
            </Stack>
          </form>
        )}
      </Formik>
    </GenericModal>
  );
}
