import { Box, FormControl, FormHelperText, InputLabel, Stack, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import React, { Dispatch, SetStateAction } from 'react';
import GenericModal from 'ui-component/modal/GenericModal';
import { ADD_PAYMENT_DETAILS } from 'views/settings/constant';
import InputFileUpload from '../upload-file';
import { useMutation } from '@apollo/client';
import { ADD_BANK_DETAIL } from '../business-management/graphql/mutations';
import {
  INFORMATION_STRIPE_IDENTIY_VERIFICATION_CHECK,
  MAXIMUM_SIZE_200KB,
  paymentDetialValidationSchema,
  UPLOAD_BACK_DOCUMENT_INFO,
  UPLOAD_FRONT_DOCUMENT
} from '../constant';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import { LoadingButton } from '@mui/lab';

type AddPaymentDetailModalType = {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

export default function AddPaymentDetailModal({ openModal, setOpenModal }: AddPaymentDetailModalType) {
  const initialValues = {
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    frontDocument: '',
    backDocument: ''
  };
  const [handleBankDetail, { loading }] = useMutation(ADD_BANK_DETAIL);
  const { successSnack, errorSnack } = useSuccErrSnack();

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
      successSnack(response?.data?.addBankDetail?.message);
      setOpenModal(false);
    } catch (err: any) {
      errorSnack(err?.message);
      setOpenModal(false);
    }
  };
  return (
    <GenericModal openModal={openModal} closeModal={() => setOpenModal(false)} title={ADD_PAYMENT_DETAILS}>
      <Formik initialValues={initialValues} validationSchema={paymentDetialValidationSchema} onSubmit={handleFormSubmit}>
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
              <Box>
                <Typography variant={'body2'} color="grey.500" mb={1.5}>
                  {INFORMATION_STRIPE_IDENTIY_VERIFICATION_CHECK}
                </Typography>
                <Stack rowGap={3}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="frontDocument">{UPLOAD_FRONT_DOCUMENT}</InputLabel>
                    <Typography variant={'body2'} color="grey.500" mb={0.5}>
                      {MAXIMUM_SIZE_200KB}
                    </Typography>
                    <InputFileUpload
                      id="frontDocument"
                      name={'frontDocument'}
                      title={UPLOAD_FRONT_DOCUMENT}
                      setFieldValue={setFieldValue}
                    />
                    {touched.frontDocument && errors.frontDocument && (
                      <FormHelperText error id="standard-weight-helper-text--register">
                        {errors.frontDocument}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="backDocument">{UPLOAD_BACK_DOCUMENT_INFO}</InputLabel>
                    <Typography variant={'body2'} color="grey.500" mb={0.5}>
                      {MAXIMUM_SIZE_200KB}
                    </Typography>
                    <InputFileUpload
                      id="backDocument"
                      name={'backDocument'}
                      title={UPLOAD_BACK_DOCUMENT_INFO}
                      setFieldValue={setFieldValue}
                    />
                    {touched.backDocument && errors.backDocument && (
                      <FormHelperText error id="standard-weight-helper-text--register">
                        {errors.backDocument}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Stack>
              </Box>
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
