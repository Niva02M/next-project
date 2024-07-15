// menu import
import samplePage from './sample-page';
import pages from './pages';
import reports from './reports';

// types
import { NavItemType } from 'types';
import settingPage from './setting';
import faqPage from './faq';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [samplePage, pages, reports, faqPage, settingPage]
};

export default menuItems;
