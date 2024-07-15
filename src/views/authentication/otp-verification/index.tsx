import React from 'react';
import { Grid, Stack, Typography, Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import Link from 'next/link';
import AuthWrapper1 from 'components/authentication/AuthWrapper1';
import Logo from 'ui-component/Logo';
import OTPTimer from '../otpTimer';

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
      <Box>
        <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
          <Grid item xs={12}>
            <Grid
              container
              justifyContent="center"
              // alignItems="center"
              sx={{
                // minHeight: "calc(100vh - 68px)",
                minHeight: '100vh',
                background: 'primary[800]',
                padding: '34px 0',
                '@media screen and (min-width:640px)': {
                  padding: '68px 0'
                }
              }}
            >
              <Grid item sx={{ m: { xs: 1, sm: 0 }, mb: 0 }}>
                <Box
                  sx={{
                    borderRadius: '12px',
                    maxWidth: '508px',
                    background: theme.palette.background.paper
                  }}
                >
                  <Grid
                    container
                    spacing="20px"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      marginTop: '0',
                      padding: '40px 24px 30px',
                      '@media screen and (min-width:640px)': {
                        padding: '80px 75px 45px'
                      }
                    }}
                  >
                    <Grid item pt="0 !important">
                      <Link href="#" aria-label="theme-logo">
                        <Logo />
                      </Link>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                        <Grid item>
                          <Typography color={theme.palette.grey[800]} textAlign="center">
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
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </AuthWrapper1>
  );
}
