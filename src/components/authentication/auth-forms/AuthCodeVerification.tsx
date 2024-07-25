'use client';

import { useState } from 'react';

// material-ui
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import OtpInput from 'react18-input-otp';
import { LoadingButton } from '@mui/lab';
// ============================|| STATIC - CODE VERIFICATION ||============================ //

interface IAuthCodeVerificationProps {
  handleContinue: (otp: string) => Promise<void>;
  remainingTimer?: number;
  isLoading?: boolean;
}

const otpLength = 6; // 6 digit, TODO: move to constants

const AuthCodeVerification = ({ handleContinue, remainingTimer, isLoading }: IAuthCodeVerificationProps) => {
  const theme = useTheme();
  const [otp, setOtp] = useState<string>();

  const onContinue = () => {
    handleContinue(otp || '');
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <OtpInput
          value={otp}
          onChange={(otpNumber: string) => setOtp(otpNumber)}
          numInputs={otpLength}
          containerStyle={{ justifyContent: 'space-between', gap: '24px' }}
          inputStyle={{
            // width: '71px !important',
            width: '100%',
            padding: '5px 8px',
            fontSize: '28px',
            lineHeight: '1.4',
            border: 'none',
            borderRadius: '12px',
            height: '54px',
            backgroundColor: theme.palette.primary.light,
            ':hover': {
              borderColor: theme.palette.primary.main
            }
          }}
          focusStyle={{
            outline: 'none',
            border: `2px solid ${theme.palette.primary.main}`
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <LoadingButton
          loading={!!isLoading}
          disabled={!otp || !remainingTimer || otp.length < otpLength}
          onClick={onContinue}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          className="gradient"
        >
          Continue
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default AuthCodeVerification;
