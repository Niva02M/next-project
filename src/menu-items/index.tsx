// menu import
import samplePage from './sample-page';
import pages from './pages';
import reports from './reports';

// types
import { NavItemType } from 'types';
import settingPage from './setting';
import aboutUsPage from './about-us';
import faqPage from './faq';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [samplePage, pages, reports, aboutUsPage, faqPage, settingPage]
};

export default menuItems;
