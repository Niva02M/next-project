'use client';

// material-ui
import { styled } from '@mui/material/styles';

// types
import { ThemeMode } from 'types/config';

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const AuthWrapper1 = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === ThemeMode.DARK ? theme.palette.background.default : theme.palette.grey[100],
  minHeight: '100vh',

  '>.MuiGrid-container >.MuiGrid-item': {
    minHeight: '100vh',
    alignItems: 'center',

    '&:last-child': {
      [theme.breakpoints.up('md')]: {
        maxHeight: '100vh',
        position: 'fixed',
        top: 0,
        right: 0,
        overflow: 'hidden',
        width: '100%',
        height: '100%'
      }
    }
  }
}));

export default AuthWrapper1;
