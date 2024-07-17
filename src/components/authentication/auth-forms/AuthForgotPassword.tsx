'use client';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { generateDeviceId } from 'utils/deviceid.helper';
import { useMutation } from '@apollo/client';
import { FORGOT_PASSWORD_MUTATION } from 'graphql/auth';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import useLocalStorageCodeVerify from 'hooks/useLocalStorageCodeVerify';
import pageRoutes from 'constants/routes';
import { useRouter } from 'next/navigation';
import useListBackendErrors from 'hooks/useShowBackEndError';

// ========================|| FIREBASE - FORGOT PASSWORD ||======================== //

const AuthForgotPassword = ({ loginProp, ...others }: { loginProp?: number }) => {
  const theme = useTheme();
  const router = useRouter();

  const { successSnack } = useSuccErrSnack();
  const { setLocalStorage } = useLocalStorageCodeVerify();
  const { handleError } = useListBackendErrors();

  const [forgotPassword] = useMutation(FORGOT_PASSWORD_MUTATION);

  return (
    <Formik
      initialValues={{
        email: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email().max(255).required().label('Email')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const deviceId = generateDeviceId();
          const { data } = await forgotPassword({
            variables: {
              body: {
                email: values.email,
                deviceId
              }
            }
          });

          setSubmitting(false);
          successSnack('Code sent successfully. Please check your email');
          setLocalStorage('forgotPassword', {
            email: values.email || '',
            expiresAt: data?.forgotPassword?.expiry?.expiresAt ? new Date(data?.forgotPassword?.expiry?.expiresAt).getTime() : 0,
            deviceId: deviceId
          });

          setTimeout(() => {
            router.push(pageRoutes.forgotPasswordVerification);
          }, 1500);
        } catch (err: any) {
          handleError(err);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-email-forgot">Email</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-forgot"
              type="email"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Enter your email"
              label="Email"
              inputProps={{}}
            />
            {touched.email && errors.email && (
              <FormHelperText error id="standard-weight-helper-text-email-forgot">
                {errors.email}
              </FormHelperText>
            )}
          </FormControl>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                Please send me the link!
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AuthForgotPassword;
