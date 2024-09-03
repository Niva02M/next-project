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

export default function UserProfile() {
  const theme = useTheme();
  const { successSnack, errorSnack } = useSuccErrSnack();
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    authProviderId: '',
    profileImage: ''
  });
  const [profileUrl, setProfileUrl] = useState();
  const [avatarPreview, setAvatarPreview] = useState('');
  const [profileFileName, setProfileFileName] = useState('');
  const [imageSize, setImageSize] = useState(false);

  const { data: userData, loading } = useQuery(GET_PROFILE_QUERY);
  const [handleUpdateProfile] = useMutation(UPDATE_PROFILE_MUTATION);
  const [getPreSignedUrl] = useLazyQuery(GET_PRESIGNED_URL);

  const handleProfilePicutreChange = async (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = e.target.files?.[0];
    //check image size is less than 200kb
    if (file && file.size > 200000) {
      setImageSize(true);
      return;
    }
    setImageSize(false);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
      try {
        // Fetch the Pre-Signed URL from your server
        const preSignedUrlResponse = await getPreSignedUrl({
          variables: {
            input: {
              contentType: file.type,
              method: 'PUT',
              path: file.name
            }
          }
        });

        const { url } = preSignedUrlResponse.data.getPreSignedUrl;

        // Upload image to the pre-signed URL using PUT request
        const uploadResponse = await fetch(url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type
          }
        });

        if (uploadResponse.ok) {
          setFieldValue('profileImage', file.name);
          setProfileFileName(file.name);
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (error) {
        throw new Error('Failed to upload image');
      }
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
      errorSnack(error.message || 'Error while submitting file');
    }
  };

  useEffect(() => {
    if (userData?.me) {
      setInitialValues({
        firstName: userData?.me?.firstName || '',
        lastName: userData?.me?.lastName || '',
        authProviderId: userData?.me?.authProviderId || '',
        profileImage: profileFileName || ''
      });
    }
    if (userData?.me?.profileImage) {
      setProfileUrl(userData?.me?.profileImage);
    }
  }, [userData, profileFileName]);

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
                        multiple
                        type="file"
                        onChange={(e) => handleProfilePicutreChange(e, setFieldValue)}
                      />
                      <Avatar src={avatarPreview || profileUrl} />
                    </UploadAvatar>
                    <Typography htmlFor="upload-avatar" component={'label'}>
                      Change profile picture <br />
                      <Typography fontSize={theme.typography.body4.fontSize} color="grey.500">Image size should be less than 200kb</Typography>
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
                {userData?.me?.authProvider === 'email' && (
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
                )}
                {userData?.me?.authProvider === 'phone' && (
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
