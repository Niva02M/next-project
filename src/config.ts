// third party
import { Poppins } from 'next/font/google';

// types
import { ConfigProps, MenuOrientation, ThemeDirection, ThemeMode } from 'types/config';

// basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
// like '/ebtheme/react/default'
export const BASE_PATH = '';

export const DASHBOARD_PATH = '/sample-page';
export const HOMEPAGE_PATH = '/home';
export const HORIZONTAL_MAX_ITEM = 7;

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

const config: ConfigProps = {
  menuOrientation: MenuOrientation.VERTICAL,
  miniDrawer: false,
  fontFamily: poppins.style.fontFamily,
  borderRadius: 12,
  outlinedFilled: true,
  mode: ThemeMode.LIGHT,
  presetColor: 'default',
  i18n: 'en',
  themeDirection: ThemeDirection.LTR,
  container: false
};

export default config;
