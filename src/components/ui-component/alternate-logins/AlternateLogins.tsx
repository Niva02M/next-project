import { Email, Phone } from '@mui/icons-material';
import { Button, Divider, Grid, Typography } from '@mui/material';
import { LOGIN_WITH_EMAIL, LOGIN_WITH_FACEBOOK, LOGIN_WITH_GOOGLE, LOGIN_WITH_PHONE, REGISTER_WITH_EMAIL, REGISTER_WITH_FACEBOOK, REGISTER_WITH_GOOGLE, REGISTER_WITH_PHONE } from 'components/authentication/constants';
import pageRoutes from 'constants/routes';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';

const handleFacebookClick = async () => {
  await signIn('facebook', {
    callbackUrl: process.env.NEXT_PUBLIC_SITE_URL + pageRoutes.dashboard
  });
};

const handleGoogleClick = async () => {
  await signIn('google', {
    callbackUrl: process.env.NEXT_PUBLIC_SITE_URL + pageRoutes.dashboard
  });
};

export default function AlternateLogins({ onLayoutChange, register }: { onLayoutChange: (value: boolean) => void; register?: boolean }) {
  const [phoneLogin, setPhoneLogin] = useState(false);

  const layoutUpdate = () => {
    onLayoutChange(phoneLogin);
  };

  return (
    <>
      <Grid display={'flex'} alignItems={'center'} sx={{ my: '34px' }}>
        <Divider sx={{ width: '45%' }} />
        <Typography sx={{ mx: '10px' }}>or</Typography>
        <Divider sx={{ width: '45%' }} />
      </Grid>
      <Grid container gap={2}>
        <Grid item xs={12}>
          <Button
            color="primary"
            variant="outlined"
            fullWidth
            startIcon={<Image src="/assets/images/auth/facebook.svg" width={24} height={24} alt="facebook" />}
            onClick={handleFacebookClick}
          >
            {register ? REGISTER_WITH_FACEBOOK : LOGIN_WITH_FACEBOOK}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            color="primary"
            variant="outlined"
            fullWidth
            startIcon={<Image src="/assets/images/auth/google.svg" width={24} height={24} alt="google" />}
            onClick={handleGoogleClick}
          >
            {register ? REGISTER_WITH_GOOGLE : LOGIN_WITH_GOOGLE}
          </Button>
        </Grid>
        <Grid item xs={12}>
          {register ? (
            <Button
              color="primary"
              variant="outlined"
              fullWidth
              startIcon={!phoneLogin ? <Phone width={24} height={24} /> : <Email width={24} height={24} />}
              onClick={() => {
                setPhoneLogin(!phoneLogin);
                layoutUpdate();
              }}
            >
              {!phoneLogin ? REGISTER_WITH_PHONE : REGISTER_WITH_EMAIL}
            </Button>
          ) : (
            <Button
              color="primary"
              variant="outlined"
              fullWidth
              startIcon={!phoneLogin ? <Phone width={24} height={24} /> : <Email width={24} height={24} />}
              onClick={() => {
                setPhoneLogin(!phoneLogin);
                layoutUpdate();
              }}
            >
              {!phoneLogin ? LOGIN_WITH_PHONE : LOGIN_WITH_EMAIL}
            </Button>
          )}
        </Grid>
      </Grid>
    </>
  );
}
