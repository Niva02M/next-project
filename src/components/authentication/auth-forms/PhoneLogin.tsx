import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, FormControl, FormHelperText, Grid, InputLabel, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';

import 'react-phone-number-input/style.css';
import { useMutation } from '@apollo/client';
import { REQUEST_PHONE_LOGIN_MUTATION } from 'graphql/auth';
import { IPhoneLoginCredential } from 'server';
import { useRouter } from 'next/navigation';
import pageRoutes from 'constants/routes';
import useSuccErrSnack from 'hooks/useSuccErrSnack';

export default function PhoneLogin() {
  const theme = useTheme();
  const router = useRouter();

  const [requestOtp] = useMutation(REQUEST_PHONE_LOGIN_MUTATION);
  const { successSnack } = useSuccErrSnack();

  const handleFormSubmit = async (values: IPhoneLoginCredential) => {
    const countryCode = parsePhoneNumber(values.phoneNumber);

    const resposeRequestOtp = await requestOtp({
      variables: {
        body: {
          number: countryCode?.number,
          dialCode: countryCode?.countryCallingCode,
          deviceId: '123456'
        }
      }
    });

    if (resposeRequestOtp?.data) {
      const expiryTimeMilliSecond = new Date(resposeRequestOtp?.data?.requestPhoneLoginOTP?.expiry?.expiresAt).getTime();
      localStorage.setItem(
        'userRegisterWithPhone',
        JSON.stringify({
          phoneNumber: countryCode?.number,
          dialCode: countryCode?.countryCallingCode,
          deviceId: '123456',
          expiryTime: expiryTimeMilliSecond
        })
      );
      successSnack(resposeRequestOtp?.data?.requestPhoneLoginOTP?.message);
      router.push(pageRoutes.verifyRegistrationPhone);
    }
  };

  return (
    <Formik
      initialValues={{
        phoneNumber: '',
        dialCode: '',
        deviceId: ''
      }}
      validationSchema={Yup.object().shape({
        phoneNumber: Yup.string().required().min(12).max(13).label('Phone')
      })}
      onSubmit={handleFormSubmit}
    >
      {({ errors, handleSubmit, touched, values, isSubmitting, setFieldValue }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container gap={3}>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                  sx={{
                    ...theme.typography.customInput,
                    '.PhoneInput': {
                      position: 'relative'
                    },
                    '.PhoneInputInput': {
                      height: 53,
                      fontSize: theme.typography.body1.fontSize,
                      borderRadius: 0,
                      appearance: 'none',
                      border: `1px solid ${theme.palette.grey[500]}`,
                      paddingLeft: '54px',
                      outline: 'none'
                    },
                    '.PhoneInputCountry': {
                      position: 'absolute',
                      top: 18,
                      left: 12
                    }
                  }}
                >
                  <InputLabel htmlFor="phoneNumber">Phone</InputLabel>
                  <PhoneInput
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={values.phoneNumber}
                    onChange={(value) => {
                      setFieldValue('phoneNumber', value);
                    }}
                    error={
                      values.phoneNumber
                        ? isValidPhoneNumber(values.phoneNumber)
                          ? undefined
                          : 'Invalid phone number'
                        : 'Phone number required'
                    }
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <FormHelperText error id="standard-weight-helper-text--register">
                      {errors.phoneNumber}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: '34px' }}>
              <LoadingButton
                loading={isSubmitting}
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                className="gradient"
              >
                Sign in now
              </LoadingButton>
            </Box>
          </form>
        );
      }}
    </Formik>
  );
}
