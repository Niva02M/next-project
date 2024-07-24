'use client';

import Link from 'next/link';

// material-ui
import { Theme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import AuthWrapper1 from 'components/authentication/AuthWrapper1';
import AuthCardWrapper from 'components/authentication/AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AuthLogin from 'components/authentication/auth-forms/AuthLogin';
import AuthSlider from 'ui-component/cards/AuthSlider';
import BackgroundPattern, { PageType } from 'ui-component/cards/BackgroundPattern';
import { AuthSliderProps } from 'types';
import { useSession } from 'next-auth/react';
import { CircularProgress } from '@mui/material';
import { UserAccountStatus } from 'constants/user';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const Login = () => {
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const { status, data } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      const payload = data?.user as any;
      if (payload?.user?.status === UserAccountStatus.email_verified) {
        setTokens(payload?.access_token, payload?.refresh_token);
        //setIsLoading(false);
        router.push('/sample-page');
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [status, data, router]);

  return isLoading ? (
    <AuthWrapper1>
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <CircularProgress />
      </Grid>
    </AuthWrapper1>
  ) : (
    <AuthWrapper1>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ height: '100vh' }}>
        <Grid item container justifyContent="center" md={6} lg={7}>
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
                <Grid item container direction="column" xs={12} sx={{ paddingTop: 4 }}>
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

export default Login;
