import React, { useEffect } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
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
import { generateDeviceId } from 'utils/deviceid.helper';
import { signIn } from 'next-auth/react';
import { FormControl, IconButton, InputAdornment, OutlinedInput, TextField, useTheme } from '@mui/material';
// import { useRouter } from 'next/navigation';
// import { UserAccountStatus } from 'constants/user';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// ===============================|| JWT LOGIN ||=============================== //

const JWTLogin = ({ loginProp, ...others }: { loginProp?: number }) => {
  // const router = useRouter();
  const theme = useTheme();

  const dispatch = useDispatch();
  // const { login } = useAuth();
  // const scriptedRef = useScriptRef();

  // const [checked, setChecked] = React.useState(true);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault()!;
  };

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
