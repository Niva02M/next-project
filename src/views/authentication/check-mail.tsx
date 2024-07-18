'use client';

import Link from 'next/link';

// material-ui
import { Theme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import AuthWrapper1 from 'components/authentication/AuthWrapper1';
import AuthCardWrapper from 'components/authentication/AuthCardWrapper';
import Logo from 'ui-component/Logo';
import BackgroundPattern1 from 'ui-component/cards/BackgroundPattern1';

// ==============================|| AUTH3 - CHECK MAIL ||============================== //

const CheckMail = () => {
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container justifyContent="center" sx={{ minHeight: '100vh' }}>
        <Grid item container justifyContent="center" md={6} lg={7} sx={{ my: 3 }}>
          <AuthCardWrapper>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item sx={{ mb: 3 }}>
                <Link href="#" aria-label="theme logo">
                  <Logo />
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="center" textAlign="center" spacing={2}>
                  <Grid item xs={12}>
                    <Typography color="secondary.main" gutterBottom variant={downMD ? 'h3' : 'h2'}>
                      Hi, Check Your Mail
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" fontSize="16px" textAlign={{ xs: 'center', md: 'inherit' }}>
                      We have sent a password recover instructions to your email.
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary">
                    Open Mail
                  </Button>
                </AnimateButton>
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

export default CheckMail;
