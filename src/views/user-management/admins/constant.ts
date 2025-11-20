import pageRoutes from 'constants/routes';

// profile tabs option
export const tabsOption = [
  {
    label: 'User profile',
    url: pageRoutes.profile,
  },
  {
    label: 'Password settings',
    url: pageRoutes.changePassword,
  },
  {
    label: 'Chat',
    url: pageRoutes.chatDashboard,
  },
];

export const PASSWORD = 'Password';
export const OLD_PASSWORD = 'Old password';
export const NEW_PASSWORD = 'New password';
export const PASSWORD_REG_MESSAGE =
  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
export const CONFIRM_NEW_PASSWORD = 'Confirm new password';
export const BOTH_PASSWORD_MUST_MATCH = 'Both Password must be match!';
export const CHANGE_PASSWORD = 'Change password';

export const rowData = [
  {
    _id: '1',
    title: 'System email',
    slug: 'systemEmail',
    description: null,
    fieldType: 'text',
    order: 1,
    options: null,
    value: '',
    values: null,
    updatedAt: '',
    createdAt: '',
  },
  {
    _id: '2',
    title: 'Application name',
    slug: 'applicationName',
    description: null,
    fieldType: 'text',
    order: 2,
    options: null,
    value: '',
    values: null,
    updatedAt: '',
    createdAt: '',
  },
  {
    _id: '3',
    title: 'Checkbox field',
    slug: 'checkboxField',
    description: null,
    fieldType: 'checkbox',
    order: 3,
    options: ['option1', 'option2', 'option3', 'option4', 'option5'],
    value: null,
    values: null,
    updatedAt: '',
    createdAt: '',
  },
  {
    _id: '4',
    title: 'Radio field',
    slug: 'radioField',
    description: null,
    fieldType: 'radio',
    order: 4,
    options: ['option1', 'option2', 'option3', 'option4', 'option5'],
    value: '',
    values: null,
    updatedAt: '',
    createdAt: '',
  },
  {
    _id: '5',
    title: 'Enable 2FA',
    slug: 'enable2fa',
    description: null,
    fieldType: 'switch',
    order: 5,
    options: null,
    value: null,
    values: null,
    updatedAt: '',
    createdAt: '',
  },
];

export type FormValues = {
  systemEmail: string;
  applicationName: string;
  checkboxField: string[];
  radioField: string;
  enable2fa: boolean;
};
