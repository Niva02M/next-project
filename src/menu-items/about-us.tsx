// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconInfoCircle } from '@tabler/icons-react';

// type
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const icons = {
  IconInfoCircle
};
const aboutUsPage: NavItemType = {
  id: 'about-us',
  title: <FormattedMessage id="about-us" />,
  icon: icons.IconInfoCircle,
  type: 'group',
  url: '/pages/about-us'
};

export default aboutUsPage;
