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
export const REGISTER_WITH_EMAIL = 'Register with Email';
export const REGISTER_WITH_PHONE = 'Register with Phone';
export const REGISTER_WITH_FACEBOOK = 'Register with Facebook';
export const REGISTER_WITH_GOOGLE = 'Register with Google';
export const INVALID_LOGIN_CREDENTIAL = 'Invalid login credential';
export const EMAIL_VERIFICATION_CODE_SENT = 'Email verification code sent, please verify your email';
export const EMAIL_VERIFICATION_FAILED = 'Email verification failed';
export const FORGOT_PASSWORD = 'Forgot password?';
export const SIGN_IN_NOW = 'Sign in now';
export const PHONE = 'Phone';
export const INVALID_PHONE_NUMBER = 'Invalid phone number';
export const PHONE_NUMBER_REQUIRED = 'Phone number required';
export const REGISTRATION_SUCCESSFUL_OTP_SENT_TO_EMAIL = 'Registration successful. OTP has been sent to your email';
export const CREATE_YOUR_ACCOUNT = 'Create your account';
export const CONFIRM_PASSWORD = 'Confirm password';
export const EMAIL = 'Email';
export const CONTACT_NUMBER = 'Contact number';
export const LAST_NAME = 'Last name';
export const FIRST_NAME = 'First name';
export const PASSWORD = 'Password';
export const OLD_PASSWORD = 'Old password';
export const NEW_PASSWORD = 'New password';
export const PASSWORD_REG_MESSAGE =
  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
export const CONFIRM_NEW_PASSWORD = 'Confirm new password';
export const BOTH_PASSWORD_MUST_MATCH = 'Both Password must be match!';
export const CHANGE_PASSWORD = 'Change password';
