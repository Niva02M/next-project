// menu import
import samplePage from './sample-page';
import pages from './pages';
import reports from './reports';

// types
import { NavItemType } from 'types';
import settingPage from './setting';
import aboutUsPage from './about-us';
import faqPage from './faq';
import privacyPolicyPage from './privacy-policy';
import termsConditionsPage from './terms-conditions';
import cookiesPolicyPage from './cookies-policy';
import homePage from './homepage';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [homePage, samplePage, aboutUsPage, faqPage, cookiesPolicyPage, privacyPolicyPage, termsConditionsPage, pages, reports, settingPage]
};

export default menuItems;
