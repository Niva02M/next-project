import { ReactElement } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// assets
const authPattern = '/assets/images/auth/auth-pattern.svg';
const authPatternDark = '/assets/images/auth/auth-pattern-dark.svg';
const resetPasswordPattern = '/assets/images/auth/reset-password-pattern.svg';
const forgotPasswordPattern = '/assets/images/auth/forgot-password-pattern.svg';
const otpVerificationPattern = '/assets/images/auth/otp-verification-pattern.svg';

// ===========================|| BACKGROUND GRID PATTERN 1 ||=========================== //

enum ThemeMode {
  DARK = 'dark',
  LIGHT = 'light'
}

export enum PageType {
  AUTH = 'auth',
  RESET_PASSWORD = 'resetPassword',
  FORGOT_PASSWORD = 'forgotPassword',
  OTP_VERIFICATION = 'otpVerification'
}

const backgroundPatternMap = {
  [ThemeMode.DARK]: {
    auth: authPatternDark,
    resetPassword: resetPasswordPattern,
    forgotPassword: forgotPasswordPattern,
    otpVerification: otpVerificationPattern
  },
  [ThemeMode.LIGHT]: {
    auth: authPattern,
    resetPassword: resetPasswordPattern,
    forgotPassword: forgotPasswordPattern,
    otpVerification: otpVerificationPattern
  }
};

const BackgroundPattern = ({ pageType, children }: { pageType: PageType; children?: ReactElement | ReactElement[] }) => {
  const theme = useTheme();
  return (
    <Box
      component="span"
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : '#fff',
        backgroundImage: `url(${backgroundPatternMap[theme.palette.mode === 'dark' ? ThemeMode.DARK : ThemeMode.LIGHT][pageType]})`,
        position: 'absolute',
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        overflow: 'hidden',
        m: '0 0 0 auto',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: theme.palette.mode === 'dark' ? 0.85 : 0.9
      }}
    >
      {children}
    </Box>
  );
};

export default BackgroundPattern;
