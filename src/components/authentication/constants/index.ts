import * as Yup from 'yup';

export const validationSchemaRegistration = Yup.object().shape({
  firstName: Yup.string().min(3).max(255).required().label('First name'),
  lastName: Yup.string().min(3).max(255).required().label('Last name'),
  phoneNumber: Yup.string().min(3).max(20).required().label('Contact number'),
  email: Yup.string().email().max(255).required().label('Email'),
  password: Yup.string().max(255).required().label('Password'),
  confirmPassword: Yup.string()
    .max(255)
    .required()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .label('Confirm Password'),
  termsChecked: Yup.bool().oneOf([true], 'The terms and conditions must be accepted.')
});

export const CODE_VERIVICATION_SUCCESS_MESSAGE = 'Code sent successfully. Please check your email';
export const LOGIN_WITH_EMAIL = 'Log in with Email';
export const LOGIN_WITH_PHONE = 'Log in with Phone';
export const LOGIN_WITH_FACEBOOK = 'Log in with Facebook';
export const LOGIN_WITH_GOOGLE = 'Log in with Google';
export const LOGIN_SUCCESSFUL = 'Login successful';
export const INVALID_LOGIN_CREDENTIAL = 'Invalid login credential';
export const EMAIL_VERIFICATION_CODE_SENT = 'Email verification code sent, please verify your email';
export const EMAIL_VERIFICATION_FAILED = 'Email verification failed';
export const FORGOT_PASSWORD = 'Forgot password?';
export const SIGN_IN_NOW = 'Sign in now';
export const PHONE = 'Phone';
export const INVALID_PHONE_NUMBER = 'Invalid phone number';
export const PHONE_NUMBER_REQUIRED = 'Phone number required';