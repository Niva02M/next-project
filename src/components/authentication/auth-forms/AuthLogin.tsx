import React from 'react';
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
import { TextField } from '@mui/material';

// ===============================|| JWT LOGIN ||=============================== //

const JWTLogin = ({ loginProp, ...others }: { loginProp?: number }) => {
  // const router = useRouter();

  const dispatch = useDispatch();
  // const { login } = useAuth();
  // const scriptedRef = useScriptRef();

  // const [checked, setChecked] = React.useState(true);

  // const [showPassword, setShowPassword] = React.useState(false);
  // const handleClickShowPassword = () => {
  //   setShowPassword(!showPassword);
  // };

  // const handleMouseDownPassword = (event: React.MouseEvent) => {
  //   event.preventDefault()!;
  // };

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
        try {
          const res = await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false,
            deviceId: generateDeviceId(),
            callbackUrl: '/'
          });
          if (res?.ok) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Your registration has been successfully completed.',
                variant: 'alert',
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
            setSubmitting(false);
          }
        } catch (err: any) {
          console.error(err);
          dispatch(
            openSnackbar({
              open: true,
              message: err.message || 'User registration failed',
              anchorOrigin: { horizontal: 'center' },
              variant: 'alert',
              alert: {
                color: 'error'
              }
            })
          );
          setSubmitting(false);
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
            <Grid item>
              <Typography variant="subtitle1" component={Link} href={'/forgot-password'} color="primary" sx={{ textDecoration: 'none' }}>
                Forgot your email?
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
