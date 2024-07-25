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
