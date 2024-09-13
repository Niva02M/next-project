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
import { IForgotPasswordResponse, ILoginUserResponse, IToken } from 'types/api-response/auth';
import { IForgotpasswordFields } from 'types/api-inputs/auth';
import { signIn } from 'next-auth/react';

export default function ForgotPasswordCodeverify() {
  const { getLocalStorage, removeItem, setLocalStorage } = useLocalStorageCodeVerify();
  const forgotPasswordDetail = getLocalStorage<IForgotpasswordValues>('forgotPassword');

  const [otpTimer, setOtpTimer] = React.useState(true);
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime(forgotPasswordDetail?.expiresAt));

  const router = useRouter();
  const { handleError } = useListBackendErrors();
  const { successSnack, errorSnack } = useSuccErrSnack();

  const [verifyFogotPasswordOtp, { data: verifyOtpData, loading: isVerifyingResetPasswordOtp }] =
    useMutation(VERIFY_FORGOT_PASSWORD_OTP_MUTATION);

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
      router.push(pageRoutes.resetPassword);
      dispatch(setForgotPasswordOTP(otp));
      setLocalStorage('forgotPassword', {
        ...forgotPasswordDetail,
        otp
      });
    } catch (error) {
      handleError(error);
    }
  };

  const tryLogin = async (tokenDetail: IToken & { user: ILoginUserResponse; _id: string }) => {
    try {
      const signInResponse = await signIn('credentials', {
        ...tokenDetail,
        user: JSON.stringify(tokenDetail.user),
        redirect: false
      });
      if (signInResponse?.ok) {
        removeItem('register');
        localStorage.setItem('accessToken', tokenDetail.accessToken);
        localStorage.setItem('refreshToken', tokenDetail.refreshToken);
        router.push(pageRoutes.dashboard);
      }
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

      if (data?.forgotPassword) {
        const newExpiryTime = new Date(data?.forgotPassword?.expiry?.expiresAt || 0).getTime();

        setLocalStorage('forgotPassword', {
          ...forgotPasswordDetail,
          expiresAt: newExpiryTime
        });

        setOtpTimer(!otpTimer);
        setRemainingTime(calculateRemainingTime(newExpiryTime));

        successSnack(data?.forgotPassword?.message || 'Code sent successfully. Please check your email');
      } else {
        errorSnack('Resending code failed. Please try again');
      }
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
