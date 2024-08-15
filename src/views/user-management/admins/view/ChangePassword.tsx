import * as Yup from 'yup';
import { Formik } from 'formik';
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
  REPEAT_NEW_PASSWORD,
  BOTH_PASSWORD_MUST_MATCH,
  NEW_PASSWORD,
  CHANGE_PASSWORD
} from '../constant';

export default function ChangePassword() {
  const { successSnack, errorSnack } = useSuccErrSnack();
  const [handleChangePassword] = useMutation(ADMIN_CHANGE_PASSWORD_MUTATION);
  const handleSubmitForm = async (values: any) => {
    delete values.confirmPassword;

    try {
      const response = await handleChangePassword({
        variables: {
          body: {
            ...values
          }
        }
      });
      successSnack(response?.data?.changePassword?.message);
    } catch (error: any) {
      console.log('error ====>', error);
      errorSnack(error.message);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        password: '',
        new_password: '',
        confirmPassword: ''
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string().max(255).required().label(OLD_PASSWORD),
        new_password: Yup.string()
          .min(8)
          .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, { PASSWORD_REG_MESSAGE })
          .required()
          .label(PASSWORD),
        confirmPassword: Yup.string()
          .required()
          .label(REPEAT_NEW_PASSWORD)
          .oneOf([Yup.ref('new_password')], BOTH_PASSWORD_MUST_MATCH)
      })}
      onSubmit={handleSubmitForm}
    >
      {({ touched, errors, values, handleBlur, handleChange, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2.5} rowGap={0.5}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{OLD_PASSWORD}</InputLabel>
                <PasswordField
                  name="password"
                  value={values.password}
                  placeholder={OLD_PASSWORD}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{NEW_PASSWORD}</InputLabel>
                <PasswordField
                  name="new_password"
                  value={values.new_password}
                  placeholder={NEW_PASSWORD}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.new_password && errors.new_password && <FormHelperText error>{errors.new_password}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{REPEAT_NEW_PASSWORD}</InputLabel>
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
      )}
    </Formik>
  );
}
