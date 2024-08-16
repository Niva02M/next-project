'use client';
// project imports

import React, { useEffect } from 'react';
import useListBackendErrors from 'hooks/useShowBackEndError';
import pageRoutes from 'constants/routes';
import AuthCodeVerification from 'components/authentication/auth-forms/AuthCodeVerification';
import { signIn } from 'next-auth/react';
import useLocalStorageCodeVerify from 'hooks/useLocalStorageCodeVerify';
import { calculateRemainingTime } from 'utils/helper';
import OtpVerificationScreen from './otp-verification';
import { IPhoneLoginVerifyCredential } from 'server';
import { REQUEST_PHONE_LOGIN_MUTATION } from 'graphql/auth';
import { useMutation } from '@apollo/client';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import { useRouter } from 'next/navigation';

// ===========================|| AUTH3 - CODE VERIFICATION ||=========================== //

const VerifyRegistrationPhone = () => {
  const { getLocalStorage, setLocalStorage } = useLocalStorageCodeVerify();
  const loginWithPhoneDetail = getLocalStorage<IPhoneLoginVerifyCredential>('userRegisterWithPhone');
  const [otpTimer, setOtpTimer] = React.useState(true);

  const [remainingTime, setRemainingTime] = React.useState(calculateRemainingTime(loginWithPhoneDetail?.expiryTime));
  const { handleError } = useListBackendErrors();
  const { successSnack, errorSnack } = useSuccErrSnack();
  const router = useRouter();

  const [resendPhoneOTP, { loading: isResendingPhoneOtp }] = useMutation(REQUEST_PHONE_LOGIN_MUTATION);

  const handleContinue = async (verificationCode: string) => {
    try {
      if (loginWithPhoneDetail?.phoneNumber) {
        await signIn('phone-login', {
          phoneNumber: loginWithPhoneDetail?.phoneNumber,
          deviceId: loginWithPhoneDetail?.deviceId,
          dialCode: loginWithPhoneDetail?.dialCode,
          verificationCode,
          redirect: false
          // callbackUrl: process.env.NEXT_PUBLIC_SITE_URL + pageRoutes.dashboard
        });
        router.replace(pageRoutes.dashboard)
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleResendCode = async () => {
    try {
      const { data } = await resendPhoneOTP({
        variables: {
          body: {
            number: loginWithPhoneDetail?.phoneNumber,
            deviceId: loginWithPhoneDetail?.deviceId,
            dialCode: loginWithPhoneDetail?.dialCode
          }
        }
      });

      console.log(data);

      if (data.requestPhoneLoginOTP) {
        setOtpTimer(!otpTimer);
        setLocalStorage('userRegisterWithPhone', {
          ...loginWithPhoneDetail,
          expiryTime: new Date(data.requestPhoneLoginOTP.expiry?.expiresAt || 0).getTime()
        });
        successSnack(data?.requestPhoneLoginOTP?.message || 'Code sent successfully. Please check your message on phone');
      } else {
        errorSnack('Resending code failed. Please try again');
      }
    } catch (error) {
      handleError(error);
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
      handleResendCode={handleResendCode}
      remainingTime={remainingTime}
      handleContinue={handleContinue}
      isLoading={isResendingPhoneOtp}
    />
  );
};

export default VerifyRegistrationPhone;
