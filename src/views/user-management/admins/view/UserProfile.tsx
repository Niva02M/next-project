'use client';
import React, { useEffect, useState } from 'react';
import { Avatar, Box, FormControl, FormHelperText, Grid, InputLabel, Stack, styled, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useMutation } from '@apollo/client';
import { UPDATE_PROFILE_MUTATION } from '../graphql/mutations';
import useSuccErrSnack from 'hooks/useSuccErrSnack';



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

export default function UserProfile({ userData, loading }: { userData: any; loading: boolean }) {
  const { successSnack, errorSnack } = useSuccErrSnack();
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    authProviderId: '',
    profileImage: ''
  });
  const [avatarPreview, setAvatarPreview] = useState('');

  const [handleUpdateProfile] = useMutation(UPDATE_PROFILE_MUTATION);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFieldValue('profileImage', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = async ({ authProviderId, ...values }: any) => {
    try {
      const response = await handleUpdateProfile({
        variables: {
          body: {
            ...values
          }
        }
      });
      successSnack(response?.data?.updateProfile?.message);
    } catch (error: any) {
      errorSnack(error);
    }
  };
  useEffect(() => {
    if (userData?.me) {
      setInitialValues({
        firstName: userData?.me?.firstName || '',
        lastName: userData?.me?.lastName || '',
        authProviderId: userData?.me?.authProviderId || '',
        profileImage: userData?.me?.profileImage || ''
      });
      setAvatarPreview(userData.me.profileImage || '');
    }
  }, [userData]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().min(2).required().label('First name'),
        lastName: Yup.string().min(2).required().label('Last name'),
        authProviderId: userData?.me
          ? Yup.string().email().required().label('Email address')
          : userData?.me?.authProviderId != 'email'
            ? Yup.string().required().label('Phone')
            : Yup.string().email().required().label('Email address'),
        profileImage: Yup.string().optional().label('Profile image')
      })}
      onSubmit={handleSubmitForm}
    >
      {({ touched, errors, values, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2.5} rowGap={0.5}>
            <Grid item xs={12}>
              <Stack direction={'row'} alignItems={'center'} spacing={2.5}>
                <UploadAvatar>
                  <input accept="image/*" id="upload-avatar" multiple type="file" onChange={(e) => handleFileChange(e, setFieldValue)} />
                  <Avatar src={avatarPreview || values.profileImage} />
                </UploadAvatar>
                <Typography htmlFor="upload-avatar" component={'label'}>
                  Change profile picture
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>First name</InputLabel>
                <TextField name="firstName" value={values.firstName} placeholder="First name" onBlur={handleBlur} onChange={handleChange} />
              </FormControl>
              {touched.firstName && errors.firstName && <FormHelperText error>{errors.firstName}</FormHelperText>}
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Last name</InputLabel>
                <TextField name="lastName" value={values.lastName} placeholder="Last name" onBlur={handleBlur} onChange={handleChange} />
              </FormControl>
              {touched.lastName && errors.lastName && <FormHelperText error>{errors.lastName}</FormHelperText>}
            </Grid>
            {userData?.me?.authProvider === 'email' ? (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Contact Email</InputLabel>
                  <TextField
                    id="email"
                    name="authProviderId"
                    fullWidth
                    type="email"
                    placeholder="Email"
                    value={values.authProviderId}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </FormControl>
                {touched.authProviderId && errors.authProviderId && <FormHelperText error>{errors.authProviderId}</FormHelperText>}
              </Grid>
            ) : (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Contact Phone</InputLabel>
                  <TextField
                    id="phone"
                    name="authProviderId"
                    value={values.authProviderId}
                    placeholder="Phone number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </FormControl>
                {touched.authProviderId && errors.authProviderId && <FormHelperText error>{errors.authProviderId}</FormHelperText>}
              </Grid>
            )}

            <Grid item xs={12}>
              <Stack alignItems={'flex-end'}>
                <LoadingButton loading={isSubmitting} disabled={isSubmitting} type="submit" variant="contained" size="large">
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
