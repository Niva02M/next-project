'use client';
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { UPDATE_PROFILE_MUTATION } from '../graphql/mutations';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import { GET_PROFILE_QUERY, GET_PRESIGNED_URL } from '../graphql/queries';
import AlignCenter from 'components/align-center/AlignCenter';
import { UploadAvatar } from '../Admin.styles';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function UserProfile() {
  const theme = useTheme();
  const { successSnack, errorSnack } = useSuccErrSnack();
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    image: ''
  });

  const { data: session, update } = useSession();

  const [profileUrl, setProfileUrl] = useState();
  const [avatarPreview, setAvatarPreview] = useState('');
  const [profileFileName, setProfileFileName] = useState('');
  const [imageSize, setImageSize] = useState(false);

  const { data: userData, loading } = useQuery(GET_PROFILE_QUERY);
  const [handleUpdateProfile] = useMutation(UPDATE_PROFILE_MUTATION, {
    refetchQueries: ['GetProfile'] // or the name of your query
  });
  // const [getPreSignedUrl] = useLazyQuery(GET_PRESIGNED_URL);

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 200000) {
      alert('Image must be under 200KB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_profile_upload');
    formData.append('cloud_name', 'dpaqe4que');
    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dpaqe4que/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.secure_url) {
        setFieldValue('image', response.data.secure_url);
        setAvatarPreview(response.data.secure_url);
      } else {
        throw new Error('Cloudinary upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
    }
  };

  const handleSubmitForm = async ({ email, ...values }: any) => {
    try {
      const response = await handleUpdateProfile({
        variables: {
          body: {
            firstName: values.firstName,
            lastName: values.lastName,
            image: values.image
          }
        }
      });
      successSnack(response?.data?.updateProfile?.message);
      await update({
        name: `${values.firstName} ${values.lastName} `,
        image: values.image
      });
    } catch (error: any) {
      errorSnack(error.message || 'Error while submitting file');
    }
  };
  useEffect(() => {
    if (session?.user) {
      const [first, ...lastParts] = (session.user.name || '').split(' ');
      const last = lastParts.join(' ');
      setInitialValues({
        firstName: first || '',
        lastName: last || '',
        email: session.user.email || '',
        image: session.user.image || ''
      });
      setAvatarPreview(session.user.image || '');
    }
  }, [session]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().min(2).required().label('First name'),
        lastName: Yup.string().min(2).required().label('Last name'),
        email:
          userData?.me?.provider === 'credentials'
            ? Yup.string().email().required().label('Email address')
            : Yup.string().email().required().label('Email address'),

        image: Yup.string().optional().label('Profile image')
      })}
      onSubmit={handleSubmitForm}
    >
      {({ touched, errors, values, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2.5} rowGap={0.5}>
            {loading ? (
              <AlignCenter>
                <CircularProgress />
              </AlignCenter>
            ) : (
              <>
                <Grid item xs={12}>
                  <Stack direction={'row'} alignItems={'center'} spacing={2.5}>
                    <UploadAvatar>
                      <input
                        accept="image/*"
                        id="upload-avatar"
                        type="file"
                        onChange={(e) => handleProfilePictureChange(e, setFieldValue)}
                      />
                      <Avatar src={avatarPreview || profileUrl} />
                    </UploadAvatar>
                    <Typography htmlFor="upload-avatar" component={'label'}>
                      Change profile picture <br />
                      <Typography fontSize={theme.typography.body4.fontSize} color="grey.500">
                        Image size should be less than 200kb
                      </Typography>
                    </Typography>
                  </Stack>
                  {imageSize && <FormHelperText error>Image size is too big to upload</FormHelperText>}
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>First name</InputLabel>
                    <TextField
                      name="firstName"
                      value={values.firstName}
                      placeholder="First name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </FormControl>
                  {touched.firstName && errors.firstName && <FormHelperText error>{errors.firstName}</FormHelperText>}
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Last name</InputLabel>
                    <TextField
                      name="lastName"
                      value={values.lastName}
                      placeholder="Last name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </FormControl>
                  {touched.lastName && errors.lastName && <FormHelperText error>{errors.lastName}</FormHelperText>}
                </Grid>
                {userData?.me?.provider === 'email' && (
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Contact Email</InputLabel>
                      <TextField
                        id="email"
                        name="email"
                        fullWidth
                        type="email"
                        placeholder="Email"
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled
                      />
                    </FormControl>
                    {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                  </Grid>
                )}
                {userData?.me?.provider === 'phone' && (
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Contact Phone</InputLabel>
                      <TextField
                        id="phone"
                        name="email"
                        value={values.email}
                        placeholder="Phone number"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled
                      />
                    </FormControl>
                    {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Stack alignItems={'flex-end'}>
                    <LoadingButton
                      loading={isSubmitting}
                      disabled={isSubmitting || imageSize}
                      type="submit"
                      variant="contained"
                      size="large"
                    >
                      Save changes
                    </LoadingButton>
                  </Stack>
                </Grid>
              </>
            )}
          </Grid>
        </form>
      )}
    </Formik>
  );
}
