'use client';

import Link from 'next/link';

// material-ui
import { Theme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthResetPassword from 'components/authentication/auth-forms/AuthResetPassword';
import AuthWrapper1 from 'components/authentication/AuthWrapper1';
import AuthCardWrapper from 'components/authentication/AuthCardWrapper';
import Logo from 'ui-component/Logo';
import BackgroundPattern1 from 'ui-component/cards/BackgroundPattern1';

// ============================|| AUTH1 - RESET PASSWORD ||============================ //

const ResetPassword = () => {
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ minHeight: '100vh' }}>
        <Grid item container justifyContent="center" md={6} lg={7} sx={{ my: 3 }}>
          <AuthCardWrapper>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
              <Grid item sx={{ mb: 3 }}>
                <Link href="#" aria-label="theme logo">
                  <Logo />
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction={{ xs: 'column-reverse', md: 'row' }} alignItems="center" justifyContent="center">
                  <Grid item>
                    <Stack alignItems="center" justifyContent="center" spacing={1}>
                      <Typography color="grey.800" gutterBottom variant={downMD ? 'h2' : 'h1'}>
                      Choose a new password
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <AuthResetPassword />
              </Grid>
            </Grid>
          </AuthCardWrapper>
        </Grid>
        <Grid item md={6} lg={5} sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }}>
          <BackgroundPattern1>
            <></>
          </BackgroundPattern1>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default ResetPassword;
