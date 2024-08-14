import React from 'react';
import { Avatar, Box, FormControl, Grid, InputLabel, Stack, styled, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';

const handleSubmitForm = () => {};

const UploadAvatar = styled(Box)(({ theme }) => ({
  'input[type="file"]': {
    position: 'absolute',
    opacity: 0,
    width: 62,
    height: 62,
    zIndex: 1
  },
  '.MuiAvatar-root': {
    width: 62,
    height: 62
  }
}));

export default function UserProfile() {
  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
      }}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().min(2).required().label('First name'),
        lastName: Yup.string().min(2).required().label('Last name'),
        phoneNumber: Yup.string().min(2).required().label('Phone'),
        email: Yup.string().email().required().label('Email')
      })}
      onSubmit={handleSubmitForm}
    >
      {({ touched, errors, values, handleBlur, handleChange, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2.5} rowGap={0.5}>
            <Grid item xs={12}>
              <Stack direction={'row'} alignItems={'center'} spacing={2.5}>
                <UploadAvatar>
                  <input accept="image/*" id="upload-avatar" multiple type="file" />
                  <Avatar src="/images/example.jpg" />
                </UploadAvatar>
                <Typography htmlFor="upload-avatar" component={'label'}>
                  Change profile picture
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>First name</InputLabel>
                <TextField value={values.firstName} placeholder="First name" onBlur={handleBlur} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Last name</InputLabel>
                <TextField value={values.lastName} placeholder="Last name" onBlur={handleBlur} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Contact Phone</InputLabel>
                <TextField value={values.phoneNumber} placeholder="Phone number" onBlur={handleBlur} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Contact Email</InputLabel>
                <TextField fullWidth type="email" placeholder="Email" value={values.email} onBlur={handleBlur} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Stack alignItems={'flex-end'}>
                <LoadingButton loading={isSubmitting} disabled={isSubmitting} variant="contained" size="large">
                  Save changes
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
