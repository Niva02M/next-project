'use client';

import { Grid } from '@mui/material';
import pageRoutes from 'constants/routes';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GuardProps } from 'types';
import Loader from 'ui-component/Loader';

const setTokens = (accessToken: string, refreshToken: string) => {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};

const AuthGuard = ({ children }: GuardProps) => {
  const { status, data } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      if (pathname !== pageRoutes.login && pathname !== pageRoutes.register) {
        router.replace(pageRoutes.login);
      }
      setIsLoading(false);
      return;
    }

    if (status === 'authenticated') {
      const user = data?.user as any;

      if (!user?.id) {
        router.replace(pageRoutes.login);
        return;
      }

      setTokens(user.access_token, user.refresh_token);

      if (
        [
          pageRoutes.login,
          pageRoutes.register,
          pageRoutes.forgotPassword,
          pageRoutes.verifyRegistration,
          pageRoutes.verifyRegistrationPhone
        ].includes(pathname)
      ) {
        router.replace(pageRoutes.dashboard);
      }

      setIsLoading(false);
    }
  }, [status, data, pathname, router]);

  return isLoading ? (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
      <Loader />
    </Grid>
  ) : (
    children
  );
};

export default AuthGuard;
