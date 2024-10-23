import { Box, FormControl, FormHelperText, InputLabel, Stack, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import GenericModal from 'ui-component/modal/GenericModal';
import { ADD_BANK_DETAILS } from 'views/settings/constant';
import InputFileUpload from '../upload-file';
import { useMutation } from '@apollo/client';
import { CREATE_CUSTOM_STRIPE_ACCOUNT } from '../business-management/graphql/mutations';
import {
  INFORMATION_STRIPE_IDENTIY_VERIFICATION_CHECK,
  MAXIMUM_SIZE_200KB,
  paymentDetialValidationSchema,
  UPLOAD_BACK_DOCUMENT,
  UPLOAD_FRONT_DOCUMENT
} from '../constant';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import { LoadingButton } from '@mui/lab';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs, { Dayjs } from 'dayjs';

type AddPaymentDetailModalType = {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  refetch: () => void;
};

export default function AddPaymentDetailModal({ openModal, setOpenModal, refetch }: AddPaymentDetailModalType) {
  const initialValues = {
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    frontDocument: '',
    backDocument: '',
    dob: Dayjs
  };
  const [handleBankDetail, { loading }] = useMutation(CREATE_CUSTOM_STRIPE_ACCOUNT);
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
      successSnack(response?.data?.createCustomStripeAccount?.message);
      setOpenModal(false);
      refetch();
    } catch (err: any) {
      errorSnack(err?.message);
      setOpenModal(false);
    }
  };
  return (
    <GenericModal openModal={openModal} closeModal={() => setOpenModal(false)} title={ADD_BANK_DETAILS}>
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
              <FormControl>
                <InputLabel>Date of birth</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    name="dob"
                    //@ts-ignore
                    inputFormat="MM/DD/YYYY"
                    //@ts-ignore
                    value={values.dob ? dayjs(values.dob) : null}
                    onChange={(newValue: Dayjs | null) => {
                      const formattedDate = newValue ? newValue.format('MM/DD/YYYY') : '';
                      handleChange({
                        target: { name: 'dob', value: formattedDate }
                      });
                    }}
                    renderInput={(params: any) => <TextField {...params} />}
                  />
                </LocalizationProvider>
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
                    <InputLabel htmlFor="backDocument">{UPLOAD_BACK_DOCUMENT}</InputLabel>
                    <Typography variant={'body2'} color="grey.500" mb={0.5}>
                      {MAXIMUM_SIZE_200KB}
                    </Typography>
                    <InputFileUpload id="backDocument" name={'backDocument'} title={UPLOAD_BACK_DOCUMENT} setFieldValue={setFieldValue} />
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
