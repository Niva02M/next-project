'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// material-ui
// import { useTheme } from '@mui/material/styles';
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
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useScriptRef from 'hooks/useScriptRef';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { REGISTER_MUTATION } from 'graphql/auth';
import { useMutation } from '@apollo/client';
import { generateDeviceId } from 'utils/deviceid.helper';

// ===========================|| JWT - REGISTER ||=========================== //

const JWTRegister = ({ ...others }) => {
  // const theme = useTheme();
  const scriptedRef = useScriptRef();
  const router = useRouter();

  const [registerUser] = useMutation(REGISTER_MUTATION);

  return (
    <>
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
        validationSchema={Yup.object().shape({
          email: Yup.string().email().max(255).required().label('Email'),
          password: Yup.string().max(255).required().label('Password'),
          confirmPassword: Yup.string()
            .max(255)
            .required()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .label('Confirm Password'),
          termsChecked: Yup.bool().oneOf([true], 'The terms and conditions must be accepted.')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            await registerUser({
              variables: {
                input: {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  password: values.password,
                  email: values.email,
                  phoneNumber: {
                    dialCode: '+977',
                    number: values.phoneNumber
                  },
                  deviceId: generateDeviceId()
                }
              }
            });

            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'User registration successfully completed',
                  anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                  variant: 'alert',
                  alert: {
                    color: 'success'
                  }
                })
              );

              setTimeout(() => {
                router.push('/login');
              }, 1500);
            }
          } catch (err: any) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'User registration failed',
                  anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                  variant: 'alert',
                  alert: {
                    color: 'error'
                  }
                })
              );
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputLabel>First name</InputLabel>
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
                <InputLabel>Last name</InputLabel>
                <TextField
                  fullWidth
                  name="lastName"
                  placeholder="Last name"
                  value={values.lastName}
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
                <InputLabel>Contact number</InputLabel>
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
                <InputLabel htmlFor="email">Email</InputLabel>
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
                <InputLabel htmlFor="password">Password</InputLabel>
                <TextField
                  fullWidth
                  name="password"
                  type="password"
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
                <InputLabel htmlFor="confirm-password">Confirm password</InputLabel>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  type="password"
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
                    <Typography variant="subtitle1">
                      Do you agree to our &nbsp;
                      <Typography variant="subtitle1" color="primary.main" component={Link} href="/">
                        terms & privacy policy.
                      </Typography>
                    </Typography>
                  }
                />
                {touched.termsChecked && errors.termsChecked && (
                  <FormHelperText error id="standard-weight-helper-text--register">
                    {errors.termsChecked}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Create your account
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default JWTRegister;
