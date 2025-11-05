'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

// material-ui
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import { generateDeviceId } from 'utils/deviceid.helper';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import { TextField, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { UserAccountStatus } from 'constants/user';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import pageRoutes from 'constants/routes';
import useLocalStorageCodeVerify from 'hooks/useLocalStorageCodeVerify';
import { LoadingButton } from '@mui/lab';
import PhoneLogin from './PhoneLogin';
import {
  EMAIL_VERIFICATION_CODE_SENT,
  EMAIL_VERIFICATION_FAILED,
  FORGOT_PASSWORD,
  INVALID_LOGIN_CREDENTIAL,
  SIGN_IN_NOW
} from '../constants';
import AlternateLogins from 'components/alternate-logins/AlternateLogins';
import PasswordField from 'components/password-filed/PasswordField';

// ===============================|| JWT LOGIN ||=============================== //

const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const JWTLogin = ({ loginProp, ...others }: { loginProp?: number }) => {
  const router = useRouter();
  const theme = useTheme();
  const { status, data, update } = useSession();
  const { setLocalStorage } = useLocalStorageCodeVerify();
  const { errorSnack, successSnack } = useSuccErrSnack();
  const [phoneLoginUi, setPhoneLoginUi] = useState(true);

  const handleLoginLayout = (value: boolean) => {
    setPhoneLoginUi(value);
  };

  // Wrap handleEmailUnverified with useCallback
  const handleEmailUnverified = useCallback(
    async (user: any, expiry: any) => {
      try {
        localStorage.clear();
        setLocalStorage('register', {
          email: user?.email,
          expiryTime: new Date(expiry?.expiresAt).getTime()
        });
        // dispatch(setLoginDetail({ email: user?.email, password: values.password }));
        await signOut({ redirect: false });
        update();
        successSnack(EMAIL_VERIFICATION_CODE_SENT);

        setTimeout(() => {
          router.push(pageRoutes.verifyRegistration);
        }, 1500);

        return;
      } catch (error) {
        errorSnack(EMAIL_VERIFICATION_FAILED);
      }
    },
    [router, update]
  ); //Add dependencies here

  useEffect(() => {
    const payload = data?.user as any;
    if (payload?.user?.status == UserAccountStatus.email_verification_pending) {
      handleEmailUnverified(payload?.user, payload?.expiry);
      return;
    }
    if (status === 'authenticated' && payload?.user?.status === UserAccountStatus.email_verified) {
      setTokens(payload?.access_token, payload?.refresh_token);
      return router.replace(pageRoutes.dashboard);
    }
  }, [status, data, router, handleEmailUnverified]);

  return (
    <>
      {phoneLoginUi ? (
        <Formik
          initialValues={{
            email: '',
            password: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('Must be a valid email').max(255).required().label('Email'),
            password: Yup.string().max(255).required().label('Password')
          })}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);

            try {
              let res = await signIn('credentials', {
                email: values.email,
                password: values.password,
                deviceId: generateDeviceId(),
                callbackUrl: '/dashboard',
                redirect: false
              });

              if (res?.ok && res?.status === 200) {
                successSnack('login-successful');
                router.push('/dashboard');
              } else {
                if (res?.error?.includes(':')) {
                  errorSnack(res.error?.split(':')?.[1] || '');
                }
                setSubmitting(false);
              }
            } catch (error: any) {
              setSubmitting(false);
              const errorMessage = error?.message ?? INVALID_LOGIN_CREDENTIAL;
              errorSnack(errorMessage);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit} {...others}>
              <Grid container gap={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
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
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                    <PasswordField
                      value={values.password}
                      name="password"
                      placeholder="Password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {touched.password && errors.password && (
                      <FormHelperText error id="standard-weight-helper-text-password-login">
                        {errors.password}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    component={Link}
                    href={'/forgot-password'}
                    color="primary"
                    sx={{ textDecoration: 'none' }}
                  >
                    {FORGOT_PASSWORD}
                  </Typography>
                </Grid>
              </Grid>

              {errors.submit && (
                <Box sx={{ mt: 3 }}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
              )}

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
                  {SIGN_IN_NOW}
                </LoadingButton>
              </Box>
            </form>
          )}
        </Formik>
      ) : (
        <PhoneLogin />
      )}
      <AlternateLogins onLayoutChange={handleLoginLayout} />
    </>
  );
};

export default JWTLogin;
