// material-ui
import { Theme, TypographyVariantsOptions } from '@mui/material/styles';

// types
import { ThemeMode, FontFamily } from 'types/config';

const Typography = (theme: Theme, borderRadius: number, fontFamily: FontFamily): TypographyVariantsOptions => ({
  fontFamily,
  h6: {
    fontWeight: 600,
    color: theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[600] : theme.palette.grey[800],
    fontSize: '0.875rem'
  },
  h5: {
    fontSize: '1rem',
    color: theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[600] : theme.palette.grey[800],
    fontWeight: 600
  },
  h4: {
    fontSize: '1.125rem',
    color: theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[600] : theme.palette.grey[800],
    fontWeight: 600
  },
  h3: {
    fontSize: '1.25rem',
    color: theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[600] : theme.palette.grey[800],
    fontWeight: 600
  },
  h2: {
    fontSize: '1.5rem',
    color: theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[600] : theme.palette.grey[800],
    fontWeight: 600
  },
  h1: {
    fontSize: '2rem',
    color: theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[600] : theme.palette.grey[800],
    fontWeight: 600
  },
  subtitle1: {
    fontSize: '0.875rem',
    fontWeight: 500
  },
  subtitle2: {
    fontSize: '0.75rem',
    fontWeight: 400
  },
  caption: {
    fontSize: '0.875rem',
    fontWeight: 400
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: '1.334em'
  },
  body2: {
    fontSize: '0.875rem',
    letterSpacing: '0em',
    fontWeight: 400,
    lineHeight: '0.875rem'
  },
  body3: {
    fontSize: '1.125rem'
  },
  body4: {
    fontSize: '0.75rem'
  },
  button: {
    textTransform: 'capitalize'
  },
  customInput: {
    marginTop: 1,
    marginBottom: 1,
    '& > label': {
      fontSize: '0.875rem',
      color: theme.palette.grey[800]
    },
    '& > div > input': {
      // padding: '30.5px 14px 11.5px !important'
      padding: '13.5px 16px'
    },
    '& legend': {
      display: 'none'
    },
    '& fieldset': {
      top: 0
    }
  },
  mainContent: {
    backgroundColor: theme.palette.mode === ThemeMode.DARK ? theme.palette.dark[800] : theme.palette.grey[100],
    width: '100%',
    minHeight: 'calc(100vh - 88px)',
    flexGrow: 1,
    padding: '20px',
    marginTop: '88px',
    marginRight: '20px',
    borderRadius: `${borderRadius}px`
  },
  menuCaption: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[600] : theme.palette.grey[900],
    padding: '6px',
    textTransform: 'capitalize',
    marginTop: '10px'
  },
  subMenuCaption: {
    fontSize: '0.6875rem',
    fontWeight: 500,
    textTransform: 'capitalize'
  },
  commonAvatar: {
    cursor: 'pointer',
    borderRadius: '8px'
  },
  smallAvatar: {
    width: '22px',
    height: '22px',
    fontSize: '1rem'
  },
  mediumAvatar: {
    width: '34px',
    height: '34px',
    fontSize: '1.2rem'
  },
  largeAvatar: {
    width: '44px',
    height: '44px',
    fontSize: '1.5rem'
  }
});

export default Typography;
