'use client';
import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { FormValues, rowData } from '../constant';
import useSuccErrSnack from 'hooks/useSuccErrSnack';

export default function EditSettings({ userData }: { userData: any }) {
  const loggedInUserId = userData?.me?._id;
  const localStorageKey = `settings_${loggedInUserId}`;
  const { errorSnack, successSnack } = useSuccErrSnack();

  const [initialValues, setInitialValues] = useState<FormValues>({
    systemEmail: '',
    applicationName: '',
    checkboxField: [],
    radioField: '',
    enable2fa: false
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem(localStorageKey);
    if (savedSettings) {
      setInitialValues(JSON.parse(savedSettings));
    }
  }, []);

  const handleSubmitForm = (values: any) => {
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(values));
      setInitialValues(values);
      successSnack('Settings saved successfully!');
    } catch (error) {
      errorSnack('Failed to save settings. Please try again.');
    }
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
          applicationName: Yup.string().min(2).required().label('Application name')
        })}
        onSubmit={(values) => handleSubmitForm(values)}
      >
        {({ errors, values, handleBlur, handleChange, handleSubmit, isSubmitting }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Grid container item md={6} spacing={2.5} rowGap={0.5}>
                {rowData.map((setting, index) => (
                  <Grid key={index} item xs={12}>
                    {setting.fieldType === 'text' && (
                      <FormControl fullWidth>
                        <InputLabel>{setting.title}</InputLabel>
                        <TextField
                          name={setting.slug}
                          value={values[setting.slug as keyof FormValues] || ''}
                          error={Boolean(errors[setting.slug as keyof FormValues])}
                          helperText={errors[setting.slug as keyof FormValues]}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </FormControl>
                    )}

                    {setting.fieldType === 'checkbox' && (
                      <>
                        <FormLabel component="legend">{setting.title}</FormLabel>
                        <FormGroup>
                          {setting?.options?.map((option) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onChange={handleChange}
                                  name={setting.slug}
                                  value={option}
                                  checked={
                                    // @ts-ignore
                                    values[setting.slug as keyof FormValues].includes(option)
                                  }
                                />
                              }
                              label={option}
                              key={option}
                            />
                          ))}
                        </FormGroup>
                      </>
                    )}

                    {setting.fieldType === 'radio' && (
                      <>
                        <FormLabel id="radio-group">{setting.title}</FormLabel>
                        <RadioGroup
                          aria-labelledby="radio-group"
                          name={setting.slug}
                          onChange={handleChange}
                          value={values[setting.slug as keyof FormValues] || ''}
                        >
                          {setting?.options?.map((option, index) => (
                            <FormControlLabel value={option} control={<Radio />} label={option} key={option} />
                          ))}
                        </RadioGroup>
                      </>
                    )}
                    {setting.fieldType === 'switch' && (
                      <>
                        <FormLabel component="legend">{setting.title}</FormLabel>
                        <Switch
                          onChange={handleChange}
                          inputProps={{ 'aria-label': 'controlled' }}
                          name={setting.slug}
                          // @ts-ignore
                          checked={values[setting.slug as keyof FormValues]}
                        />
                      </>
                    )}
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Stack alignItems={'flex-start'}>
                    <LoadingButton loading={isSubmitting} disabled={isSubmitting} type="submit" variant="contained" size="large">
                      Save changes
                    </LoadingButton>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </>
  );
}
