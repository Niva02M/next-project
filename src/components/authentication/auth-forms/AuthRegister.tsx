'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
// import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
// import IconButton from '@mui/material/IconButton';
// import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
// import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useScriptRef from 'hooks/useScriptRef';
import { dispatch } from 'store';
// import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { openSnackbar } from 'store/slices/snackbar';

// types
// import { StringColorProps } from 'types';

// assets
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===========================|| JWT - REGISTER ||=========================== //

const JWTRegister = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const router = useRouter();

  const { ADMIN_REGISTER } = useGQL();

  const [handleRegister, { loading, error, data }] = ADMIN_REGISTER();

  // const [showPassword, setShowPassword] = React.useState(false);
  const [checked, setChecked] = React.useState(true);
  // const [strength, setStrength] = React.useState(0);
  // const [level, setLevel] = React.useState<StringColorProps>();

  // const handleClickShowPassword = () => {
  //   setShowPassword(!showPassword);
  // };

  // const handleMouseDownPassword = (event: React.SyntheticEvent) => {
  //   event.preventDefault();
  // };

  const changePassword = (value: string) => {
    // const temp = strengthIndicator(value);
    // setStrength(temp);
    // setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('123456');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          contactNumber: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
          confirmPassword: Yup.string()
            .max(255)
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password')], 'Passwords must match')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            // await register(values.firstName, values.lastName, values.email, values.password, values.contactNumber);
            await handleRegister({
              variables: {
                input: {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  email: values.email,
                  password: values.password,
                  contactNumber: values.contactNumber
                }
              }
            });
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
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

              setTimeout(() => {
                router.push('/login');
              }, 1500);
            }
          } catch (err: any) {
            console.error(err);
            if (scriptedRef.current) {
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
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
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
                  name="contactNumber"
                  placeholder="Your contact number"
                  value={values.contactNumber}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.contactNumber && errors.contactNumber && (
                  <FormHelperText error id="contactNumber-error">
                    {errors.contactNumber}
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
            </Grid>

            {/* <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-register"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                label="Password"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
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
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-register">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl> */}

            {/* {strength !== 0 && (
              <FormControl fullWidth>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            )} */}

            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                  }
                  label={
                    <Typography variant="subtitle1">
                      Do you agree to our &nbsp;
                      <Typography variant="subtitle1" color="primary.main" component={Link} href="/">
                        terms & privacy policy.
                      </Typography>
                    </Typography>
                  }
                />
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
