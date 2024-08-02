import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, FormControl, FormHelperText, Grid, InputLabel, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PhoneInput, {  isValidPhoneNumber } from 'react-phone-number-input'

import 'react-phone-number-input/style.css';
import { signIn } from 'next-auth/react';
import { generateDeviceId } from 'utils/deviceid.helper';
import useSuccErrSnack from 'hooks/useSuccErrSnack';

function PhoneLogin() {
  const theme = useTheme();
  const { errorSnack, successSnack } = useSuccErrSnack();

  const handleFormSubmit = async() => {
    try {
      const res = await signIn('credentials', {
        phone: values.phone,
        deviceId: generateDeviceId(),
        redirect: false,
        callbackUrl: '/'
      });
      if (res?.ok) {
        successSnack('Login successful');
      } else {
        if (res?.error?.includes(':')) {
          errorSnack(res.error?.split(':')?.[1] || '');
        }
      }
    } catch (err: any) {
      errorSnack(err.message || 'Login failed');
    }
  };
  const [value, setValue] = useState();

  return (
    <Formik
      initialValues={{
        phone: ''
      }}
      validationSchema={Yup.object().shape({
        phone: Yup.string().label('Phone')
      })}
      onSubmit={handleFormSubmit}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, touched, values, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <Grid container gap={3}>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={Boolean(touched.phone && errors.phone)}
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
                    outline: 'none',
                  },
                  '.PhoneInputCountry': {
                    position: 'absolute',
                    top: 18,
                    left: 12
                  }
                }}
              >
                <InputLabel htmlFor="phone">Phone</InputLabel>
                {/* <TextField
                  fullWidth
                  name="phone"
                  type="phone"
                  placeholder="Enter your phone"
                  value={values.phone}
                  onBlur={handleBlur}
                  onChange={handleChange}
                /> */}
                <PhoneInput
                  placeholder="Enter phone number"
                  value={value}
                  onChange={() => setValue}
                  error={value ? (isValidPhoneNumber(value) ? undefined : 'Invalid phone number') : 'Phone number required'}
                />
                {touched.phone && errors.phone && (
                  <FormHelperText error id="standard-weight-helper-text--register">
                    {errors.phone}
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
      )}
    </Formik>
  );
}

export default PhoneLogin;
