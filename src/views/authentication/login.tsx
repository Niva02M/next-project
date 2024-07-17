'use client';

import Link from 'next/link';

// material-ui
import { Theme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import AuthFooter from 'ui-component/cards/AuthFooter';
import AuthWrapper1 from 'components/authentication/AuthWrapper1';
import AuthCardWrapper from 'components/authentication/AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AuthLogin from 'components/authentication/auth-forms/AuthLogin';
import AuthSlider from 'ui-component/cards/AuthSlider';
import { Box } from '@mui/material';
import BackgroundPattern1 from 'ui-component/cards/BackgroundPattern1';

// ================================|| AUTH3 - LOGIN ||================================ //

// carousel items
const items: AuthSliderProps[] = [
  {
    title: 'Components Based Design System',
    description: 'Powerful and easy to use multipurpose theme'
  },
  {
    title: 'Components Based Design System',
    description: 'Powerful and easy to use multipurpose theme'
  },
  {
    title: 'Components Based Design System',
    description: 'Powerful and easy to use multipurpose theme'
  }
];

const Login = () => {
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ minHeight: '100vh' }}>
        <Grid item container justifyContent="center" md={6} lg={7} sx={{ my: 3 }}>
          <AuthCardWrapper>
            <Grid container spacing={2.5} alignItems="center" justifyContent="center">
              <Grid item>
                <Link href="#" aria-label="logo">
                  <Logo />
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction={{ xs: 'column-reverse', md: 'row' }} alignItems="center" justifyContent="center">
                  <Grid item>
                    <Stack alignItems="center" justifyContent="center" spacing={1}>
                      <Typography color="grey.800" gutterBottom variant={downMD ? 'h2' : 'h1'}>
                        Sign in to your account
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <AuthLogin />
              </Grid>
              <Grid item xs={12}>
                <Grid item container direction="column" xs={12} sx={{ paddingTop: 2 }}>
                  <Typography
                    color={'primary'}
                    component={Link}
                    href={'/register'}
                    variant="body1"
                    fontWeight={500}
                    sx={{ textDecoration: 'none' }}
                  >
                    Don&apos;t have an account? Register today!
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </AuthCardWrapper>
        </Grid>
        <Grid item md={6} lg={5} sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }}>
          <BackgroundPattern1>
            <Grid item container alignItems="flex-end" justifyContent="center" spacing={3}>
              <Grid item xs={12}>
                <Grid item container justifyContent="center" sx={{ pb: 8 }}>
                  <Grid item xs={10} lg={8} sx={{ '& .slick-list': { pb: 2 } }}>
                    <AuthSlider items={items} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </BackgroundPattern1>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;
