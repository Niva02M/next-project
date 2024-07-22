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
const settingPage: NavItemType = {
  id: 'setting',
  title: <FormattedMessage id="settings" />,
  icon: icons.IconBrandChrome,
  type: 'group',
  url: '/setting'
};

export default settingPage;
