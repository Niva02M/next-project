// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconBrandChrome } from '@tabler/icons-react';

// type
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const icons = {
  IconBrandChrome
};
const dashboard: NavItemType = {
  id: 'dashboard',
  title: <FormattedMessage id="dashboard" />,
  icon: icons.IconBrandChrome,
  type: 'group',
  url: '/dashboard'
};

export default dashboard;
