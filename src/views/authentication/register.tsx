'use client';

import Link from 'next/link';

// material-ui
import { Theme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from 'components/authentication/AuthWrapper1';
import AuthCardWrapper from 'components/authentication/AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AuthRegister from 'components/authentication/auth-forms/AuthRegister';
import BackgroundPattern, { PageType } from 'ui-component/cards/BackgroundPattern';
import AuthSlider from 'ui-component/cards/AuthSlider';
import { AuthSliderProps } from 'types';

// ===============================|| AUTH - REGISTER ||=============================== //

const items: AuthSliderProps[] = [
  {
    title: 'Company name makes the most features per item of all time',
    description: 'Our platform makes booking and scheduling a breeze, so you can focus on delivering great service to your clients'
  },
  {
    title: 'Power of React with Material UI',
    description: 'Powerful and easy to use multipurpose theme'
  },
  {
    title: 'Company name makes the most features per item of all time',
    description: 'Our platform makes booking and scheduling a breeze, so you can focus on delivering great service to your clients'
  }
];

const Register = () => {
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container sx={{ minHeight: 'calc(100vh - 68px)' }}>
        <Grid item container justifyContent="center" md={6} lg={7}>
          <AuthCardWrapper>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
              <Grid item sx={{ mb: '1px' }}>
                <Link href="#" aria-label="theme logo">
                  <Logo />
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction={{ xs: 'column-reverse', md: 'row' }} alignItems="center" justifyContent="center">
                  <Grid item>
                    <Stack alignItems="center" justifyContent="center" spacing={1}>
                      <Typography color="grey.800" gutterBottom variant={downMD ? 'h2' : 'h1'}>
                        Sign me up!
                      </Typography>
                      <Typography color="grey.800" variant="caption" fontSize="16px" textAlign={{ xs: 'center', md: 'inherit' }}>
                        Create your business account now
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <AuthRegister />
              </Grid>
              <Grid item xs={12}>
                <Grid item container direction="column" xs={12} sx={{ paddingTop: 4 }}>
                  <Typography
                    component={Link}
                    href={'/login'}
                    variant="body1"
                    color="primary"
                    fontWeight={500}
                    sx={{ textDecoration: 'none' }}
                  >
                    Already have an account? Log in
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </AuthCardWrapper>
        </Grid>
        <Grid item md={6} lg={5} sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }}>
          <BackgroundPattern pageType={PageType.AUTH}>
            <Grid item container alignItems="flex-end" justifyContent="center" spacing={3}>
              <Grid item xs={12}>
                <Grid item container justifyContent="center" sx={{ pb: 8 }}>
                  <Grid item xs={10} lg={8} sx={{ '& .slick-list': { pb: 2 } }}>
                    <AuthSlider items={items} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </BackgroundPattern>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Register;
