import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, FormControl, FormHelperText, Grid, InputLabel, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

function PhoneLogin() {
  const handleFormSubmit = () => {};
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
              <FormControl fullWidth error={Boolean(touched.phone && errors.phone)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="phone">Phone</InputLabel>
                <TextField
                  fullWidth
                  name="phone"
                  type="phone"
                  placeholder="Enter your phone"
                  value={values.phone}
                  onBlur={handleBlur}
                  onChange={handleChange}
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
