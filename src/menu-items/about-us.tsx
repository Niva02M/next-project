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
const aboutUsPage: NavItemType = {
  id: 'about-us',
  title: <FormattedMessage id="About-us" />,
  icon: icons.IconShieldLock,
  type: 'group',
  url: '/pages/about-us',
  target: true
};

export default aboutUsPage;
