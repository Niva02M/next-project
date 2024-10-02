import { Box, Button, FormControl, FormHelperText, InputLabel, Stack, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import React, { Dispatch, SetStateAction, useState } from 'react';
import GenericModal from 'ui-component/modal/GenericModal';
import { ADD_PAYMENT_DETAILS } from 'views/settings/constant';
import InputFileUpload from '../upload-file';
import { useMutation } from '@apollo/client';
import { ADD_BANK_DETAIL } from '../business-management/graphql/mutations';

type AddPaymentDetailModalType = {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

export default function AddPaymentDetailModal({ openModal, setOpenModal }: AddPaymentDetailModalType) {
  const [initialValues, setInitialValues] = useState({
    accountName: '',
    accountNumber: '',
    bsb: ''
  });
  const [handleBankDetail, { data }] = useMutation(ADD_BANK_DETAIL);
  const handleFormSubmit = async() => {
    await handleBankDetail({
      variables: {
        body: {
          accountHolderType: null,
          accountName: null,
          accountNumber: null,
          accountType: null,
          identityDocumentBack: null,
          identityDocumentFront: null,
          routingNumber: null
        }
      }
    });
    setInitialValues({
      accountName: '',
      accountNumber: '',
      bsb: ''
    });
  };
  return (
    <GenericModal openModal={openModal} closeModal={() => setOpenModal(false)} title={ADD_PAYMENT_DETAILS}>
      <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          isSubmitting
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
                <TextField fullWidth name="bsb" value={values.bsb} onBlur={handleBlur} onChange={handleChange} placeholder="000000" />
                {touched.bsb && errors.bsb && (
                  <FormHelperText error id="standard-weight-helper-text--register">
                    {errors.bsb}
                  </FormHelperText>
                )}
              </FormControl>
              <Box>
                <Typography variant={'body2'} color="grey.500" mb={1.5}>
                  {`Please upload passport, driver's license or photo card for Stripe's identity verification check. Your files will be not stroed
                  in our system.`}
                </Typography>
                <Stack rowGap={3}>
                  <FormControl fullWidth>
                    <InputLabel>{'Upload front document'}</InputLabel>
                    <Typography variant={'body2'} color="grey.500" mb={0.5}>
                      {`Maximum Size: 5Mb`}
                    </Typography>
                    <InputFileUpload title={'Upload front document'} />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>{'Upload back document (If using passport, add inside photo page twice)'}</InputLabel>
                    <Typography variant={'body2'} color="grey.500" mb={0.5}>
                      {`Maximum Size: 5Mb`}
                    </Typography>
                    <InputFileUpload title={'Upload back document(If using passport, add inside photo page twice)'} />
                  </FormControl>
                </Stack>
              </Box>
              <Button type="submit" variant="contained" size="large">
                Save changes
              </Button>
            </Stack>
          </form>
        )}
      </Formik>
    </GenericModal>
  );
}
