// menu import
import samplePage from './sample-page';
import pages from './pages';
import reports from './reports';

// types
import { NavItemType } from 'types';
import settingPage from './setting';
import privacyPolicyPage from './privacy-policy';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [samplePage, pages, reports, privacyPolicyPage, settingPage]
};

export default menuItems;
