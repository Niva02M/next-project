import React from 'react';
import { Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import Link from 'next/link';
import AuthWrapper1 from 'components/authentication/AuthWrapper1';
import Logo from 'ui-component/Logo';
import OTPTimer from '../otpTimer';
import AuthCardWrapper from 'components/authentication/AuthCardWrapper';
import BackgroundPattern1 from 'ui-component/cards/BackgroundPattern1';

interface IOtpVerificationScreenProps {
  otpInputComponent: React.ReactNode;
  handleResendCode: () => void;
  handleContinue: (otp: string) => Promise<void>;
  remainingTime: number | undefined;
  isLoading?: boolean;
}

export default function OtpVerificationScreen({
  otpInputComponent,
  handleResendCode,
  remainingTime,
  isLoading
}: IOtpVerificationScreenProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
        <Grid item container justifyContent="center" md={6} lg={7}>
          <AuthCardWrapper>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item>
                <Link href="#" aria-label="theme-logo">
                  <Logo />
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                  <Grid item>
                    <Typography color={theme.palette.grey[600]} textAlign="center">
                      Please enter verification code sent to your email or phone
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {otpInputComponent}
              </Grid>
              <Grid item xs={12}>
                <Stack rowGap="20px">
                  <Typography color="#1c1c1c" textAlign="center">
                    Did not receive the code? Check your spam filter, or
                  </Typography>
                  <LoadingButton
                    onClick={handleResendCode}
                    loading={!!isLoading}
                    variant="outlined"
                    disabled={typeof remainingTime == 'number' && remainingTime <= 0 ? false : true}
                    fullWidth
                    size="large"
                    className="gradient"
                    disableRipple
                  >
                    Resend code
                  </LoadingButton>
                  {typeof remainingTime == 'number' ? <OTPTimer remainingTime={remainingTime} /> : null}
                </Stack>
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
}
