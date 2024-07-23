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
const homePage: NavItemType = {
  id: 'homepage',
  title: <FormattedMessage id="homepage" />,
  icon: icons.IconInfoCircle,
  type: 'group',
  url: '/homepage'
};

export default homePage;
