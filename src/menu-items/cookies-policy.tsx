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
const cookiesPolicyPage: NavItemType = {
  id: 'cookies-policy',
  title: <FormattedMessage id="cookies-policy" />,
  icon: icons.IconShieldLock,
  type: 'group',
  url: '/cookies-policy'
};

export default cookiesPolicyPage;
