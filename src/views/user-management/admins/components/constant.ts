import * as Yup from 'yup';

export const paymentDetialValidationSchema = Yup.object().shape({
  accountName: Yup.string().min(6).max(100).required('Enter a valid account name').label('Account name'),
  accountNumber: Yup.string().min(9).max(20).required('Enter a valid account number').label('Account number'),
  routingNumber: Yup.string().min(6).max(10).required('Enter a valid BSB number').label('BSB'),
  frontDocument: Yup.string().required().label('Front document'),
  backDocument: Yup.string().required().label('Back document')
});

export const addBankAccountValidationSchema = Yup.object().shape({
  accountName: Yup.string().min(6).max(100).required('Enter a valid account name').label('Account name'),
  accountNumber: Yup.string().min(9).max(20).required('Enter a valid account number').label('Account number'),
  routingNumber: Yup.string().min(6).max(10).required('Enter a valid BSB number').label('BSB'),
  accountHolderType: Yup.string().required().label('Account holder type'),
  accountType: Yup.string().required().label('Account type')
});

export const UPLOAD_FRONT_DOCUMENT = 'Upload front document';
export const MAXIMUM_SIZE_200KB = 'Maximum Size: 200kb';
export const INFORMATION_STRIPE_IDENTIY_VERIFICATION_CHECK = `Please upload passport, driver's license or photo card for Stripe's identity verification check. Your files will be not stroed
in our system.`;
export const UPLOAD_BACK_DOCUMENT = 'Upload back document';

export const PAYOUT_DETAILS = 'Payout details';

export const verificationStatus = {
  PENDING: 'Pending',
  COMPLETE: 'Complete'
};

export const payOutDetials = {
  ACCOUNT_ID: 'Account id',
  ACCOUNT_STATUS: 'Account status',
  ACCOUNT_TYPE: 'Account type',
  VERIFICATION_STATUS: 'Verification status'
};

export const externalAccounts = {
  ACCOUNT_NUMBER: 'Acc no',
  BSB: 'BSB',
  STATUS: 'Status'
};

export const DELETE_BUSINESS_USER_TITLE = 'Delete business user account?';
export const DELETE_BUSINESS_USER_DESCRIPTION = 'Deleting business user will not allow to use this as payout method in future?';

export const DELETE_USER_BANK_ACCOUNT_TITLE = 'Delete bank user account?';
export const DELETE_USER_BANK_ACCOUNT_DESCRIPTION = 'Deleting bank user account will not allow to use this as payout method in future?';

export const UPDATE_DEFAULT_BANK_ACCOUNT_TITLE = 'Update default bank account?';
export const UPDATE_DEFAULT_BANK_ACCOUNT_DESCRIPTION = 'Update default bank account to use this as payout method in future?';

export const accountHolderTypeSelect = [
  {
    value: 'INDIVIDUAL',
    label: 'Individual'
  },
  {
    value: 'COMPANY',
    label: 'Company'
  }
];

export const accountTypeSelect = [
  {
    value: 'CHECKING',
    label: 'Checking'
  },
  {
    value: 'FUTSU',
    label: 'Futsu'
  },
  {
    value: 'Sniv231G',
    label: 'Sniv231g'
  },
  {
    value: 'TOZA',
    label: 'Toza'
  }
];
