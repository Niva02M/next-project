'use client';

import React, { useState } from 'react';
import OtpVerificationScreen from '../otp-verification';
import { FORGOT_PASSWORD_MUTATION, VERIFY_FORGOT_PASSWORD_OTP_MUTATION } from 'graphql/auth';
import useListBackendErrors from 'hooks/useShowBackEndError';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import { dispatch } from 'store';
import { useRouter } from 'next/navigation';
import pageRoutes from 'constants/routes';
import { useMutation } from '@apollo/client';
import AuthCodeVerification from 'components/authentication/auth-forms/AuthCodeVerification';
import { setForgotPasswordOTP } from 'store/slices/emailVerification';
import useLocalStorageCodeVerify from 'hooks/useLocalStorageCodeVerify';
import { IForgotpasswordValues } from 'types/localStorageValues';
import { calculateRemainingTime } from 'utils/helper';
import { IForgotPasswordResponse } from 'types/api-response/auth';
import { IForgotpasswordFields } from 'types/api-inputs/auth';

export default function ForgotPasswordCodeverify() {
  const { getLocalStorage, setLocalStorage } = useLocalStorageCodeVerify();
  const forgotPasswordDetail = getLocalStorage<IForgotpasswordValues>('forgotPassword');

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime(forgotPasswordDetail?.expiresAt));

  const router = useRouter();
  const { handleError } = useListBackendErrors();
  const { successSnack } = useSuccErrSnack();

  const [verifyFogotPasswordOtp, { loading: isVerifyingResetPasswordOtp }] = useMutation(VERIFY_FORGOT_PASSWORD_OTP_MUTATION);

  const [forgotPassword, { loading: isResendingPassword }] = useMutation<IForgotPasswordResponse, { body: IForgotpasswordFields }>(
    FORGOT_PASSWORD_MUTATION
  );

  const handleContinue = async (otp: string) => {
    try {
      await verifyFogotPasswordOtp({
        variables: {
          body: {
            email: forgotPasswordDetail?.email || '',
            verificationCode: otp
          }
        }
      });
      setLocalStorage('forgotPassword', {
        ...forgotPasswordDetail,
        otp
      });
      dispatch(setForgotPasswordOTP(otp));
      successSnack('Code verified successfully');
      router.push(pageRoutes.resetPassword);
    } catch (error) {
      handleError(error);
    }
  };

  const handleResendCode = async () => {
    try {
      const { data } = await forgotPassword({
        variables: {
          body: {
            email: forgotPasswordDetail?.email || '',
            deviceId: forgotPasswordDetail?.deviceId || ''
          }
        }
      });
      setLocalStorage('forgotPassword', {
        email: forgotPasswordDetail?.email || '',
        expiresAt: data?.forgotPassword?.data?.expiresAt ? new Date(data?.forgotPassword?.data?.expiresAt).getTime() : 0,
        deviceId: forgotPasswordDetail?.deviceId || ''
      });
      successSnack('Code sent successfully');
    } catch (error) {
      handleError(error);
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      const newRemainingTime = calculateRemainingTime(forgotPasswordDetail?.expiresAt);
      setRemainingTime(newRemainingTime);

      if (newRemainingTime && newRemainingTime <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [forgotPasswordDetail?.expiresAt]);

  return (
    <OtpVerificationScreen
      otpInputComponent={
        <AuthCodeVerification handleContinue={handleContinue} remainingTimer={remainingTime} isLoading={isVerifyingResetPasswordOtp} />
      }
      handleContinue={handleContinue}
      handleResendCode={handleResendCode}
      remainingTime={remainingTime}
      isLoading={isResendingPassword}
    />
  );
}
