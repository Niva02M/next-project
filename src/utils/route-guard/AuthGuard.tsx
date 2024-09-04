'use client';

import { Grid } from '@mui/material';
import pageRoutes from 'constants/routes';
import { UserAccountStatus } from 'constants/user';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    if (status === 'authenticated') {
      const payload = data?.user as any;
      if (payload?.user?.status === UserAccountStatus.email_verified || payload?.user?._id) {
        setTokens(payload?.access_token, payload?.refresh_token);

        if (pathname) {
          router.replace(pathname);
        } else {
          router.replace(pageRoutes.dashboard);
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    } else if (status === 'unauthenticated') {
      router.replace(pageRoutes.login);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [status, data, router, pathname]);

  return isLoading ? (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
      <Loader />
    </Grid>
  ) : (
    children
  );
};

export default AuthGuard;
