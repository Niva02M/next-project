'use client';
import React, { useEffect, useState } from 'react';
import { Avatar, Box, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, InputLabel, Radio, RadioGroup, Stack, styled, Switch, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import { rowData } from '../constant';

export default function EditSettings() {
  const { successSnack, errorSnack } = useSuccErrSnack();
  const [initialValues, setInitialValues] = useState({
    systemEmail: '',
    applicationName: '',
    checkbox: [
      {
        option1: false
      },
      {
        option2: false
      },
      {
        option3: false
      }
    ]
    // authProviderId: '',
    // profileImage: ''
  });

  const handleSubmitForm = async () => {
    // try {
    //   const response = await handleUpdateProfile({
    //     variables: {
    //       body: {
    //         ...values
    //       }
    //     }
    //   });
    //   successSnack(response?.data?.updateProfile?.message);
    // } catch (error: any) {
    //   errorSnack(error);
    // }
  };


  return (
    <>
      <Typography variant="h2">Edit settings</Typography>
      <Divider sx={{ my: 3 }} />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          systemEmail: Yup.string().min(2).required().label('System email'),
          applicationName: Yup.string().min(2).required().label('Application name'),
        })}
        onSubmit={handleSubmitForm}
      >
        {({ touched, errors, values, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue }) => {
          console.log('values ===>', values);
          return(
          <form onSubmit={handleSubmit}>
            <Grid container item md={6} spacing={2.5} rowGap={0.5}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>System email</InputLabel>
                  <TextField
                    name="systemEmail"
                    value={values.systemEmail}
                    placeholder="System email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </FormControl>
                {touched.systemEmail && errors.systemEmail && <FormHelperText error>{errors.systemEmail}</FormHelperText>}
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Application name</InputLabel>
                  <TextField
                    name="applicationName"
                    value={values.applicationName}
                    placeholder="Application name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </FormControl>
                {touched.applicationName && errors.applicationName && <FormHelperText error>{errors.applicationName}</FormHelperText>}
              </Grid>
              <Grid item xs={12}>
                {/* <Typography variant="h6">Checkbox field</Typography> */}
                <FormLabel component="legend">Checkbox field</FormLabel>
                <FormGroup>
                  {rowData.map((name, index) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          // checked={rowData.values?.includes(name)}
                          onChange={handleChange}
                          // name={`data.${key}.values`}
                          name={`${name}-${index}`}
                          value={name}
                        />
                      }
                      label={name}
                      key={index + name}
                    />
                  ))}
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormLabel id="demo-radio-buttons-group-label">Radio field</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  // name={`data.${key}.value`}
                  onChange={handleChange}
                >
                  {rowData.map((name, index) => (
                    <FormControlLabel
                      // checked={rowData.value === name ? true : false}
                      value={name}
                      control={<Radio />}
                      label={name}
                      key={index + name}
                    />
                  ))}
                </RadioGroup>
              </Grid>
              <Grid item xs={12}>
                <FormLabel component="legend">Switch</FormLabel>
                <Switch
                  // checked={values.data[key].value.toString() == 'true' ? true : false}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                  // name={`data.${key}.value`}
                  // value={values.data[key].value}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack alignItems={'flex-start'}>
                  <LoadingButton loading={isSubmitting} disabled={isSubmitting} type="submit" variant="contained" size="large">
                    Save changes
                  </LoadingButton>
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}}
      </Formik>
    </>
  );
}
