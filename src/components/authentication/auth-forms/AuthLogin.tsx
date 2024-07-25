'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import { Divider, IconButton, InputAdornment, OutlinedInput, TextField, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { UserAccountStatus } from 'constants/user';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import pageRoutes from 'constants/routes';
import useLocalStorageCodeVerify from 'hooks/useLocalStorageCodeVerify';
import { LoadingButton } from '@mui/lab';

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
  const [showPassword, setShowPassword] = React.useState(false);

  const { status, data, update } = useSession();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault()!;
  };

  const handleFacebookClick = async () => {
    await signIn('facebook', {
      callbackUrl: process.env.NEXT_PUBLIC_SITE_URL + pageRoutes.dashboard
    });
  };

  const handleGoogleClick = async () => {
    await signIn('google', {
      callbackUrl: process.env.NEXT_PUBLIC_SITE_URL + pageRoutes.dashboard
    });
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
      successSnack('Email verification code sent, please verify your email');

      setTimeout(() => {
        router.push(pageRoutes.verifyRegistration);
      }, 1500);

      return;
    } catch (error) {
      errorSnack('Email verification failed');
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
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().max(255).required('Password is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setSubmitting(true);
        try {
          const res = await signIn('credentials', {
            email: values.email,
            password: values.password,
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
          setSubmitting(false);
        } catch (err: any) {
          errorSnack(err.message || 'Login failed');
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
                Forgot password?
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
              loading={status === 'loading' && true}
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
  );
};

export default JWTLogin;
