import { FormControl, FormHelperText, InputLabel, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import React, { Dispatch, SetStateAction, useState } from 'react';
import GenericModal from 'ui-component/modal/GenericModal';
import { ADD_PAYMENT_DETAILS } from 'views/settings/constant';

type AddPaymentDetailModalType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

export default function AddPaymentDetailModal({ open, setOpen, openModal, setOpenModal }: AddPaymentDetailModalType) {
  const [initialValues, setInitialValues] = useState({
    accountName: '',
    accountNumber: '',
    bsb: ''
  });
  const handleFormSubmit = () => {
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
            <FormControl>
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
            <FormControl>
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
            <FormControl>
              <InputLabel>{'BSB'}</InputLabel>
              <TextField fullWidth name="bsb" value={values.bsb} onBlur={handleBlur} onChange={handleChange} placeholder="000000" />
              {touched.bsb && errors.bsb && (
                <FormHelperText error id="standard-weight-helper-text--register">
                  {errors.bsb}
                </FormHelperText>
              )}
            </FormControl>
            <Typography>
              {`Please upload passport, driver's license or photo card for Stripe's identity verification check. Your files will be not stroed
              in our system.`}
            </Typography>
            <FormControl>
              <InputLabel>{'Upload front document'}</InputLabel>
              {/* <TextField fullWidth name="bsb" value={values.bsb} onBlur={handleBlur} onChange={handleChange} placeholder="000000" /> */}
              {/* {touched.bsb && errors.bsb && (
                <FormHelperText error id="standard-weight-helper-text--register">
                  {errors.bsb}
                </FormHelperText>
              )} */}
            </FormControl>
            <FormControl>
              <InputLabel>{'Upload back document (If using passport, add inside photo page twice)'}</InputLabel>
              {/* <TextField fullWidth name="bsb" value={values.bsb} onBlur={handleBlur} onChange={handleChange} placeholder="000000" /> */}
              {/* {touched.bsb && errors.bsb && (
                <FormHelperText error id="standard-weight-helper-text--register">
                  {errors.bsb}
                </FormHelperText>
              )} */}
            </FormControl>
          </form>
        )}
      </Formik>
    </GenericModal>
  );
}
