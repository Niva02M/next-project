'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third party
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import { REGISTER_MUTATION } from 'graphql/auth';
import { useMutation } from '@apollo/client';
import { generateDeviceId } from 'utils/deviceid.helper';
import useLocalStorageCodeVerify from 'hooks/useLocalStorageCodeVerify';
import { IRegisterValues } from 'types/localStorageValues';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import pageRoutes from 'constants/routes';
import {
  CONFIRM_PASSWORD,
  CONTACT_NUMBER,
  CREATE_YOUR_ACCOUNT,
  EMAIL,
  FIRST_NAME,
  LAST_NAME,
  PASSWORD,
  REGISTRATION_SUCCESSFUL_OTP_SENT_TO_EMAIL,
  validationSchemaRegistration
} from '../constants';
import AlternateLogins from 'ui-component/alternate-logins/AlternateLogins';
import PhoneLogin from './PhoneLogin';
import useListBackendErrors from 'hooks/useShowBackEndError';
import PasswordField from 'ui-component/password-filed/PasswordField';

// ===========================|| JWT - REGISTER ||=========================== //

const JWTRegister = ({ ...others }) => {
  const [phoneLoginUi, setPhoneLoginUi] = useState(true);

  const scriptedRef = useScriptRef();
  const router = useRouter();
  const { setLocalStorage } = useLocalStorageCodeVerify();
  const { successSnack } = useSuccErrSnack();
  const { handleError } = useListBackendErrors();

  const [registerUser] = useMutation(REGISTER_MUTATION);

  const handleLoginLayout = (value: boolean) => {
    setPhoneLoginUi(value);
  };

  return (
    <>
      {phoneLoginUi ? (
        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            termsChecked: false,
            submit: null
          }}
          validationSchema={validationSchemaRegistration}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              const { data } = await registerUser({
                variables: {
                  input: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    password: values.password,
                    email: values.email,
                    phoneNumber: {
                      dialCode: '+977', // TODO: take dial code from input or constant
                      number: values.phoneNumber
                    },
                    deviceId: generateDeviceId()
                  }
                }
              });

              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
                setLocalStorage<IRegisterValues>('register', {
                  email: values.email,
                  expiryTime: new Date(data?.registerUser.expiry.expiresAt).getTime()
                });
                successSnack(REGISTRATION_SUCCESSFUL_OTP_SENT_TO_EMAIL);

                router.push(pageRoutes.verifyRegistration);
              }
            } catch (err: any) {
              if (scriptedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
                handleError(err);
              }
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit} {...others}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputLabel>{FIRST_NAME}</InputLabel>
                  <TextField
                    fullWidth
                    name="firstName"
                    placeholder="First name"
                    value={values.firstName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.firstName && errors.firstName && (
                    <FormHelperText error id="firstName-error">
                      {errors.firstName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>{LAST_NAME}</InputLabel>
                  <TextField
                    fullWidth
                    name="lastName"
                    placeholder="Last name"
                    value={values.lastName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.lastName && errors.lastName && (
                    <FormHelperText error id="lastName-error">
                      {errors.lastName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>{CONTACT_NUMBER}</InputLabel>
                  <TextField
                    fullWidth
                    name="phoneNumber"
                    placeholder="Your contact number"
                    value={values.phoneNumber}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <FormHelperText error id="phoneNumber-error">
                      {errors.phoneNumber}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="email">{EMAIL}</InputLabel>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text--register">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="password">{PASSWORD}</InputLabel>
                  <PasswordField
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text--register">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="confirm-password">{CONFIRM_PASSWORD}</InputLabel>
                  <PasswordField
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={values.confirmPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <FormHelperText error id="standard-weight-helper-text--register">
                      {errors.confirmPassword}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={values.termsChecked} onChange={handleChange} name="termsChecked" color="primary" />}
                    label={
                      <Typography variant="body1">
                        Do you agree to our &nbsp;
                        <Typography variant="body1" color="primary.main" component={Link} href="/terms-conditions">
                          terms & privacy policy.
                        </Typography>
                      </Typography>
                    }
                    sx={{ my: '-9px' }}
                  />
                  {touched.termsChecked && errors.termsChecked && (
                    <FormHelperText error id="standard-weight-helper-text--register">
                      {errors.termsChecked}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Box sx={{ mt: '34px' }}>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  {CREATE_YOUR_ACCOUNT}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      ) : (
        <PhoneLogin />
      )}
      <AlternateLogins register={true} onLayoutChange={handleLoginLayout} />
    </>
  );
};

export default JWTRegister;
