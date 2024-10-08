import * as Yup from 'yup';

export const paymentDetialValidationSchema = Yup.object().shape({
  accountName: Yup.string().min(3).max(100).required().label('Account name'),
  accountNumber: Yup.string().min(3).max(100).required().label('Account number'),
  routingNumber: Yup.string().min(3).max(100).required().label('BSB'),
  frontDocument: Yup.string().required().label('Front document'),
  backDocument: Yup.string().required().label('Back document')
});

export const UPLOAD_FRONT_DOCUMENT = 'Upload front document';
export const MAXIMUM_SIZE_200KB = 'Maximum Size: 200kb';
export const INFORMATION_STRIPE_IDENTIY_VERIFICATION_CHECK = `Please upload passport, driver's license or photo card for Stripe's identity verification check. Your files will be not stroed
in our system.`;
export const UPLOAD_BACK_DOCUMENT_INFO = 'Upload back document (If using passport, add inside photo page twice)';
