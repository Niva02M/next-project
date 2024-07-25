// menu import
import dashboard from './dashboard';
import pages from './pages';
import reports from './reports';

// types
import { NavItemType } from 'types';
import settingPage from './setting';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [dashboard, pages, reports, settingPage]
};

export default menuItems;
