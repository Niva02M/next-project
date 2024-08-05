'use client';
// project imports

import React, { useEffect } from 'react';
import useListBackendErrors from 'hooks/useShowBackEndError';
import pageRoutes from 'constants/routes';
import AuthCodeVerification from 'components/authentication/auth-forms/AuthCodeVerification';
// import useSuccErrSnack from 'hooks/useSuccErrSnack';
import { signIn } from 'next-auth/react';
import useLocalStorageCodeVerify from 'hooks/useLocalStorageCodeVerify';
import { calculateRemainingTime } from 'utils/helper';
import OtpVerificationScreen from './otp-verification';
import { IPhoneLoginVerifyCredential } from 'server';

// ===========================|| AUTH3 - CODE VERIFICATION ||=========================== //

const VerifyRegistrationPhone = () => {
  const { getLocalStorage } = useLocalStorageCodeVerify();
  const loginWithPhoneDetail = getLocalStorage<IPhoneLoginVerifyCredential>('userRegisterWithPhone');

  const [remainingTime, setRemainingTime] = React.useState(calculateRemainingTime(loginWithPhoneDetail?.expiryTime));
  const { handleError } = useListBackendErrors();
  // const { errorSnack, successSnack } = useSuccErrSnack();

  const handleContinue = async (verificationCode: string) => {
    try {
      if (loginWithPhoneDetail?.phoneNumber) {
        await signIn('phone-login', {
          phoneNumber: loginWithPhoneDetail?.phoneNumber,
          deviceId: loginWithPhoneDetail?.deviceId,
          dialCode: loginWithPhoneDetail?.dialCode,
          verificationCode,
          callbackUrl: process.env.NEXT_PUBLIC_SITE_URL + pageRoutes.dashboard
        });
      }
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemainingTime = calculateRemainingTime(loginWithPhoneDetail?.expiryTime);
      setRemainingTime(newRemainingTime);

      if (newRemainingTime && newRemainingTime <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [loginWithPhoneDetail?.expiryTime]);

  return (
    <OtpVerificationScreen
      otpInputComponent={<AuthCodeVerification handleContinue={handleContinue} isLoading={false} remainingTimer={remainingTime} />}
      remainingTime={remainingTime}
      handleContinue={handleContinue}
      isLoading={false}
    />
  );
};

export default VerifyRegistrationPhone;
