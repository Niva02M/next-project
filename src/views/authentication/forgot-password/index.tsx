'use client';

import Link from 'next/link';

// material-ui
import { Theme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthForgotPassword from 'components/authentication/auth-forms/AuthForgotPassword';
import AuthWrapper1 from 'components/authentication/AuthWrapper1';
import AuthCardWrapper from 'components/authentication/AuthCardWrapper';
import Logo from 'ui-component/Logo';

// ============================|| AUTH - FORGOT PASSWORD ||============================ //

const ForgotPassword = () => {
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
        <AuthCardWrapper>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item>
              <Link href="#" aria-label="theme-logo">
                <Logo />
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="center" textAlign="center" spacing={2}>
                <Grid item xs={12}>
                  <Typography color="secondary.main" gutterBottom variant={downMD ? 'h3' : 'h2'}>
                    I forgot my password
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" fontSize="16px" textAlign="center">
                    Enter your email address below and we will send you password reset OTP.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <AuthForgotPassword />
            </Grid>
          </Grid>
        </AuthCardWrapper>
      </Grid>
    </AuthWrapper1>
  );
};

export default ForgotPassword;
