import React, { useEffect } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
// import useAuth from 'hooks/useAuth';
// import useScriptRef from 'hooks/useScriptRef';
// import { DASHBOARD_PATH } from 'config';

import { openSnackbar } from 'store/slices/snackbar';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { generateDeviceId } from 'utils/deviceid.helper';
import { signIn, useSession } from 'next-auth/react';
import { TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { UserAccountStatus } from 'constants/user';

// ===============================|| JWT LOGIN ||=============================== //

const JWTLogin = ({ loginProp, ...others }: { loginProp?: number }) => {
  const theme = useTheme();
  const router = useRouter();

  const dispatch = useDispatch();
  // const { login } = useAuth();
  // const scriptedRef = useScriptRef();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault()!;
  };

  const session = useSession();

  const handleEmailUnverified = async (user: any, expiry: any) => {
    try {
      localStorage.clear();
      localStorage.setItem('timer', `${new Date().getTime() + expiry?.expiresBy}`);
      // dispatch(setLoginDetail({ email: user?.email, password: values.password }));
      // await signOut({ redirect: false });
      session.update();
      // successSnack(errorMessages.EMAIL_UNVERIFIED);

      // redirect to code verification page with some delay
      setTimeout(() => {
        // router.push(pageRoutes.codeVerification);
        router.push('/code-verification');
      }, 3000);

      return;
    } catch (error) {
      // errorSnack(errorMessages.EMAIL_UNVERIFIED);
      console.log(error);
    }
  };

  // useEffect(() => {
  //   console.log({ session });
  //   const userDetail = session?.data?.user as any;
  //   if (userDetail?.user?.status == UserAccountStatus.email_verification_pending) {
  //     handleEmailUnverified(userDetail?.user, userDetail?.expiry);
  //     return;
  //   }
  //   console.log(userDetail, 'userDetail');
  // }, [dispatch, router, session]);

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
            dispatch(
              openSnackbar({
                open: true,
                message: 'Login successful',
                variant: 'alert',
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                alert: {
                  color: 'success'
                },
                close: false
              })
            );
          } else {
            if (res?.error?.includes(':')) {
              console.error(res.error);
              // errorSnack(res.error?.split(':')?.[1] || '');
            }
          }
          setSubmitting(false);
        } catch (err: any) {
          console.error(err);
          dispatch(
            openSnackbar({
              open: true,
              message: err.message || 'Login failed',
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'alert',
              alert: {
                color: 'error'
              }
            })
          );
          // errorSnack(errorMessages.ERROR_IN_SIGNIN);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <Grid container gap={3}>
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
              <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password-login"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  placeholder="password"
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
              <Typography variant="subtitle1" component={Link} href={'/forgot-password'} color="primary" sx={{ textDecoration: 'none' }}>
                Forgot password?
              </Typography>
            </Grid>
          </Grid>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                Sign in now
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
