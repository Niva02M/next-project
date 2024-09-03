// third-party
import { FormattedMessage } from 'react-intl';

// assets
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

// type
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const icons = {
  PeopleAltOutlinedIcon
};
const clients: NavItemType = {
  id: 'clients',
  title: <FormattedMessage id="clients" />,
  icon: icons.PeopleAltOutlinedIcon,
  type: 'group',
  url: '/clients'
};

export default clients;
