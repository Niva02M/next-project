// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconKey } from '@tabler/icons-react';
import { ReportIcon } from 'components/icons';
import { NavItemType } from 'types';

// constant
const icons = {
  IconKey,
  ReportIcon
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const reports: NavItemType = {
  id: 'reports-title',
  title: <FormattedMessage id="reports" />,
  caption: '',
  icon: icons.IconKey,
  type: 'group',
  children: [
    {
      id: 'Report',
      title: <FormattedMessage id="reports" />,
      type: 'item',
      icon: icons.ReportIcon,
      url: '/'
    }
  ]
};

export default reports;
