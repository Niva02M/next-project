import * as Yup from 'yup';
import { Formik, FormikHelpers } from 'formik';
import { useMutation } from '@apollo/client';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import { LoadingButton } from '@mui/lab';
import { FormControl, FormHelperText, Grid, InputLabel, Stack } from '@mui/material';
import PasswordField from 'components/password-filed/PasswordField';
import { ADMIN_CHANGE_PASSWORD_MUTATION } from '../graphql/mutations';
import {
  PASSWORD,
  OLD_PASSWORD,
  PASSWORD_REG_MESSAGE,
  CONFIRM_NEW_PASSWORD,
  BOTH_PASSWORD_MUST_MATCH,
  NEW_PASSWORD,
  CHANGE_PASSWORD
} from '../constant';

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePassword() {
  const { successSnack, errorSnack } = useSuccErrSnack();
  const [handleChangePassword] = useMutation(ADMIN_CHANGE_PASSWORD_MUTATION);

  const handleSubmitForm = async (values: PasswordFormValues, { setSubmitting }: FormikHelpers<PasswordFormValues>) => {
    const newValue = { ...values };
    delete (newValue as any).confirmPassword;

    try {
      const response = await handleChangePassword({
        variables: {
          body: {
            ...newValue
          }
        }
      });
      successSnack(response?.data?.changePassword?.message);
    } catch (error: any) {
      errorSnack(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik<PasswordFormValues>
      enableReinitialize
      initialValues={{
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }}
      validationSchema={Yup.object().shape({
        currentPassword: Yup.string().max(255).required().label(OLD_PASSWORD),
        newPassword: Yup.string()
          .min(8)
          .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, PASSWORD_REG_MESSAGE) // Fixed: removed the object wrapper
          .required()
          .label(PASSWORD),
        confirmPassword: Yup.string()
          .required()
          .label(CONFIRM_NEW_PASSWORD)
          .oneOf([Yup.ref('newPassword')], BOTH_PASSWORD_MUST_MATCH)
      })}
      onSubmit={handleSubmitForm}
    >
      {({ touched, errors, values, handleBlur, handleChange, handleSubmit, isSubmitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5} rowGap={0.5}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{OLD_PASSWORD}</InputLabel>
                  <PasswordField
                    name="currentPassword"
                    value={values.currentPassword}
                    placeholder={OLD_PASSWORD}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.currentPassword && errors.currentPassword && <FormHelperText error>{errors.currentPassword}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>{NEW_PASSWORD}</InputLabel>
                  <PasswordField
                    name="newPassword"
                    value={values.newPassword}
                    placeholder={NEW_PASSWORD}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.newPassword && errors.newPassword && <FormHelperText error>{errors.newPassword}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>{CONFIRM_NEW_PASSWORD}</InputLabel>
                  <PasswordField
                    name="confirmPassword"
                    value={values.confirmPassword}
                    placeholder="Repeat password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.confirmPassword && errors.confirmPassword && <FormHelperText error>{errors.confirmPassword}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Stack alignItems={'flex-end'}>
                  <LoadingButton loading={isSubmitting} disabled={isSubmitting} variant="contained" size="large" type="submit">
                    {CHANGE_PASSWORD}
                  </LoadingButton>
                </Stack>
              </Grid>
            </Grid>
          </form>
        );
      }}
    </Formik>
  );
}
