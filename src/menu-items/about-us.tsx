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
  title: <FormattedMessage id="about-us" />,
  icon: icons.IconShieldLock,
  type: 'item',
  url: '/pages/about-us'
};

export default aboutUsPage;
