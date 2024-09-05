'use client';
// project imports

import { useMutation } from '@apollo/client';
// import { RESEND_MAIL_OTP } from 'graphql/auth';
import React, { useEffect } from 'react';
import useListBackendErrors from 'hooks/useShowBackEndError';
import { useRouter } from 'next/navigation';
import pageRoutes from 'constants/routes';
import AuthCodeVerification from 'components/authentication/auth-forms/AuthCodeVerification';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import { signIn } from 'next-auth/react';
import { ILoginUserResponse, IToken } from 'types/api-response/auth';
import useLocalStorageCodeVerify from 'hooks/useLocalStorageCodeVerify';
import { IRegisterValues } from 'types/localStorageValues';
import { calculateRemainingTime } from 'utils/helper';
import OtpVerificationScreen from './otp-verification';
import { RESEND_VERIFY_EMAIL_OTP_MUTATION, VERIFY_EMAIL_MUTATION } from 'graphql/auth';
import { generateDeviceId } from 'utils/deviceid.helper';

// ===========================|| AUTH3 - CODE VERIFICATION ||=========================== //

const VerifyRegistration = () => {
  const { getLocalStorage, removeItem, setLocalStorage } = useLocalStorageCodeVerify();
  const loginDetail = getLocalStorage<IRegisterValues>('register');

  const [otpTimer, setOtpTimer] = React.useState(true);
  const [remainingTime, setRemainingTime] = React.useState(calculateRemainingTime(loginDetail?.expiryTime));
  const { handleError } = useListBackendErrors();
  const { errorSnack, successSnack } = useSuccErrSnack();

  const router = useRouter();

  const [resendEmailOTP, { loading: isResendingEmailOtp }] = useMutation(RESEND_VERIFY_EMAIL_OTP_MUTATION);
  const [verifyEmail, { loading: isVerifyingEmail }] = useMutation(VERIFY_EMAIL_MUTATION);

  const handleContinue = async (otp: string) => {
    try {
      const { data } = await verifyEmail({
        variables: {
          body: {
            email: loginDetail?.email || '',
            verificationCode: otp
          }
        }
      });

      if (data?.verifyEmail) {
        successSnack(data?.verifyEmail?.message || 'Email verified successfully');
        if (data.verifyEmail?.token) {
          await tryLogin({
            ...data.verifyEmail.token,
            user: data.verifyEmail.user,
            _id: data.verifyEmail.user._id
          });
        }
      }
    } catch (err) {
      handleError(err);
    }
  };

  const tryLogin = async (tokenDetail: IToken & { user: ILoginUserResponse; _id: string }) => {
    try {
      const signInResponse = await signIn('credentials', {
        ...tokenDetail,
        redirect: false
      });
      console.log('signInResponse', signInResponse);
      if (signInResponse) {
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
      const { data } = await resendEmailOTP({
        variables: {
          body: {
            email: loginDetail?.email || '',
            deviceId: generateDeviceId()
          }
        }
      });

      if (data.resendVerifyEmailOtp) {
        setOtpTimer(!otpTimer);
        setLocalStorage('register', {
          ...loginDetail,
          expiryTime: new Date(data.resendVerifyEmailOtp.expiry?.expiresAt || 0).getTime()
        });
        successSnack(data?.resendVerifyEmailOtp?.message || 'Code sent successfully. Please check your email');
      } else {
        errorSnack('Resending code failed. Please try again');
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemainingTime = calculateRemainingTime(loginDetail?.expiryTime);
      setRemainingTime(newRemainingTime);

      if (newRemainingTime && newRemainingTime <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [loginDetail?.expiryTime]);

  return (
    <OtpVerificationScreen
      otpInputComponent={
        <AuthCodeVerification handleContinue={handleContinue} isLoading={isVerifyingEmail} remainingTimer={remainingTime} />
      }
      handleResendCode={handleResendCode}
      remainingTime={remainingTime}
      handleContinue={handleContinue}
      isLoading={isResendingEmailOtp}
    />
  );
};

export default VerifyRegistration;
