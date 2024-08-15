import { LoadingButton } from '@mui/lab';
import { FormControl, Grid, InputLabel, Stack } from '@mui/material';
import PasswordField from 'components/password-filed/PasswordField';
import { Formik } from 'formik';
import * as Yup from 'yup';

const handleSubmitForm = () => {};

export default function ChangePassword() {
  return (
    <Formik
      initialValues={{
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }}
      validationSchema={Yup.object().shape({
        oldPassword: Yup.string().min(2).required().label('Old password'),
        newPassword: Yup.string().min(2).required().label('New password'),
        confirmPassword: Yup.string().min(2).required().label('Confirm password')
      })}
      onSubmit={handleSubmitForm}
    >
      {({ touched, errors, values, handleBlur, handleChange, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2.5} rowGap={0.5}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Old password</InputLabel>
                <PasswordField
                  name="oldPassword"
                  value={values.oldPassword}
                  placeholder="Old password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>New password</InputLabel>
                <PasswordField
                  name="newPassword"
                  value={values.newPassword}
                  placeholder="New password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Repeat new password</InputLabel>
                <PasswordField
                  name="confirmPassword"
                  value={values.confirmPassword}
                  placeholder="Repeat password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Stack alignItems={'flex-end'}>
                <LoadingButton loading={isSubmitting} disabled={isSubmitting} variant="contained" size="large">
                  Change password
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
