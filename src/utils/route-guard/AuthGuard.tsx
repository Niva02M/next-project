'use client';

import { Grid } from '@mui/material';
import { UserAccountStatus } from 'constants/user';
//import useAuth from 'hooks/useAuth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// // project imports
// import useAuth from 'hooks/useAuth';
// import { useEffect } from 'react';
// import Loader from 'components/ui-component/Loader';

// types
import { GuardProps } from 'types';
import Loader from 'ui-component/Loader';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */

const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const AuthGuard = ({ children }: GuardProps) => {
  const { status, data } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      const payload = data?.user as any;
      if (payload?.user?.status === UserAccountStatus.email_verified) {
        setTokens(payload?.access_token, payload?.refresh_token);

        router.push('/sample-page');
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [status, data, router]);

  return isLoading ? (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
      <Loader />
    </Grid>
  ) : (
    children
  );
};

export default AuthGuard;
