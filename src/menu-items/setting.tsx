// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { SettingIcon } from 'components/icons';

// type
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const icons = {
  SettingIcon
};
const settingPage: NavItemType = {
  id: 'setting',
  title: <FormattedMessage id="settings" />,
  icon: icons.SettingIcon,
  type: 'group',
  url: '/setting'
};

export default settingPage;
