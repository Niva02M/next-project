// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { HomeIcon } from 'components/icons';

// type
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const icons = {
  HomeIcon
};
const dashboard: NavItemType = {
  id: 'dashboard',
  title: <FormattedMessage id="dashboard" />,
  icon: icons.HomeIcon,
  type: 'group',
  url: '/dashboard'
};

export default dashboard;
