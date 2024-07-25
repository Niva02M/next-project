'use client';

import Link from 'next/link';

// material-ui
import { Theme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from 'components/authentication/AuthWrapper1';
import AuthCardWrapper from 'components/authentication/AuthCardWrapper';
import Logo from 'ui-component/Logo';
import BackgroundPattern, { PageType } from 'ui-component/cards/BackgroundPattern';
import pageRoutes from 'constants/routes';

// ==============================|| AUTH3 - CHECK MAIL ||============================== //

const CheckMail = () => {
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container>
        <Grid item container alignItems={'center'} justifyContent="center" md={6} lg={7}>
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
                    <Typography gutterBottom variant={downMD ? 'h2' : 'h1'}>
                      Please check your email.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" fontSize="16px" textAlign={{ xs: 'center', md: 'inherit' }} color="grey.600">
                      {`We have sent you a link to reset your password. If you don't get it please check your junk email folder just in case
                      it ends up in there by mistake.`}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth size="large" type="submit" variant="contained" color="primary" href={pageRoutes.login}>
                  Return to login
                </Button>
              </Grid>
            </Grid>
          </AuthCardWrapper>
        </Grid>
        <Grid item md={6} lg={5} sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }}>
          <BackgroundPattern pageType={PageType.OTP_VERIFICATION} />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default CheckMail;
