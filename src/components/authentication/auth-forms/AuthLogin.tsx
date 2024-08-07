'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// material-ui
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import { generateDeviceId } from 'utils/deviceid.helper';
import { signIn, signOut, useSession } from 'next-auth/react';
import { IconButton, InputAdornment, OutlinedInput, TextField, useTheme } from '@mui/material';
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
  LOGIN_SUCCESSFUL,
  SIGN_IN_NOW
} from '../constants';
import AlternateLogins from 'ui-component/alternate-logins/AlternateLogins';

// ===============================|| JWT LOGIN ||=============================== //

const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const JWTLogin = ({ loginProp, ...others }: { loginProp?: number }) => {
  const router = useRouter();
  const theme = useTheme();

  // const dispatch = useDispatch();

  const { setLocalStorage } = useLocalStorageCodeVerify();

  const { errorSnack, successSnack } = useSuccErrSnack();
  const [showPassword, setShowPassword] = useState(false);

  const [phoneLoginUi, setPhoneLoginUi] = useState(true);
  const handleLoginLayout = (value: boolean) => {
    setPhoneLoginUi(value);
  };

  const { status, data, update } = useSession();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault()!;
  };

  const handleEmailUnverified = async (user: any, expiry: any) => {
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
  };

  useEffect(() => {
    const payload = data?.user as any;
    if (payload?.user?.status == UserAccountStatus.email_verification_pending) {
      handleEmailUnverified(payload?.user, payload?.expiry);
      return;
    }
    if (status === 'authenticated' && payload?.user?.status === UserAccountStatus.email_verified) {
      setTokens(payload?.access_token, payload?.refresh_token);
      return router.push(pageRoutes.dashboard);
    }
  }, [status, data, router]);

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
            let res = await signIn('credentials', {
              email: values.email,
              password: values.password,
              deviceId: generateDeviceId(),
              redirect: false,
              callbackUrl: pageRoutes.dashboard
            });
            if (res?.ok) {
              res = await signIn('credentials', {
                email: values.email,
                password: values.password,
                deviceId: generateDeviceId(),
                callbackUrl: pageRoutes.dashboard
              });
              successSnack(LOGIN_SUCCESSFUL);
            } else {
              res = await signIn('credentials', {
                email: values.email,
                password: values.password,
                deviceId: generateDeviceId(),
                redirect: false
              });
              errorSnack(INVALID_LOGIN_CREDENTIAL);
            }
            setSubmitting(false);
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
                    <OutlinedInput
                      id="outlined-adornment-password-login"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      placeholder="Password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      inputProps={{}}
                      label="Password"
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
