// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconShieldLock } from '@tabler/icons-react';

// type
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const icons = {
    IconShieldLock
};
const privacyPolicyPage: NavItemType = {
  id: 'privacy-policy',
  title: <FormattedMessage id="privacy-policy" />,
  icon: icons.IconShieldLock,
  type: 'group',
  url: '/privacy-policy'
};

export default privacyPolicyPage;
