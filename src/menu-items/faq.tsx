// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconQuestionMark } from '@tabler/icons-react';

// type
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const icons = {
  IconQuestionMark
};
const faqPage: NavItemType = {
  id: 'faq',
  title: <FormattedMessage id="faq" />,
  icon: icons.IconQuestionMark,
  type: 'group',
  url: '/pages/faqs'
};

export default faqPage;
