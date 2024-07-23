'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

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
import { Divider } from '@mui/material';

// third party
import * as Yup from 'yup';
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

// ===========================|| JWT - REGISTER ||=========================== //

const JWTRegister = ({ ...others }) => {
  // const theme = useTheme();
  const scriptedRef = useScriptRef();

  const { setLocalStorage } = useLocalStorageCodeVerify();

  const router = useRouter();
  const { successSnack, errorSnack } = useSuccErrSnack();

  const [registerUser] = useMutation(REGISTER_MUTATION);

  const handleFacebookClick = async () => {
    await signIn('facebook', {
      callbackUrl: process.env.NEXT_PUBLIC_SITE_URL + '/sample-page'
    });
  };

  const handleGoogleClick = async () => {
    await signIn('google', {
      callbackUrl: process.env.NEXT_PUBLIC_SITE_URL + '/sample-page'
    });
  };

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
              successSnack('Registration successful. OTP has been sent to your email');

              router.push(pageRoutes.verifyRegistration);
            }
          } catch (err: any) {
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
              errorSnack('User registration failed');
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
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: '34px' }}>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Create your account
                </Button>
            </Box>
            <Grid display={'flex'} alignItems={'center'} sx={{ my: '34px' }}>
              <Divider sx={{ width: '45%' }} />
              <Typography sx={{ mx: '10px' }}>or</Typography>
              <Divider sx={{ width: '45%' }} />
            </Grid>

            <Grid container gap={2}>
              <Grid item xs={12}>
                <Button
                  color="primary"
                  variant="outlined"
                  fullWidth
                  startIcon={<Image src="/assets/images/auth/facebook.svg" width={24} height={24} alt="facebook" />}
                  onClick={handleFacebookClick}
                >
                  Log in with Facebook
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  color="primary"
                  variant="outlined"
                  fullWidth
                  startIcon={<Image src="/assets/images/auth/google.svg" width={24} height={24} alt="google" />}
                  onClick={handleGoogleClick}
                >
                  Log in with Google
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default JWTRegister;
