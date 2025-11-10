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
import { RESEND_VERIFY_EMAIL_OTP_MUTATION, VERIFY_OTP_MUTATION } from 'graphql/auth';
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
  const [verifyOtp, { loading: isVerifyingEmail }] = useMutation(VERIFY_OTP_MUTATION);

  const handleContinue = async (otp: string) => {
    try {
      const { data } = await verifyOtp({
        variables: {
          body: {
            email: loginDetail?.email || '',
            otp
          }
        }
      });

      if (data?.verifyOtp) {
        successSnack(data?.verifyOtp?.message || 'Email verified successfully');
        if (data.verifyOtp?.token) {
          const userData = {
            _id: data.verifyOtp?.user?._id ?? '',
            email: data.verifyOtp?.user?.email ?? '',
            status: data.verifyOtp?.user?.status ?? 'email_verified'
          };
          await tryLogin({
            ...data.verifyOtp.token,
            user: userData,
            _id: data.verifyOtp.user._id
          });
        }
      }
    } catch (err) {
      handleError(err);
    }
  };

  const tryLogin = async (tokenDetail: IToken & { user: ILoginUserResponse; _id: string }) => {
    try {
      console.log('Token detail:', tokenDetail);
      const signInResponse = await signIn('credentials', {
        ...tokenDetail,
        user: JSON.stringify(tokenDetail.user),
        redirect: false
      });
      console.log('Sign in response:', signInResponse);

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
      const { data } = await resendEmailOTP({
        variables: {
          body: {
            email: loginDetail?.email || '',
            deviceId: generateDeviceId()
          }
        }
      });

      if (data.resendverifyOtpOtp) {
        setOtpTimer(!otpTimer);
        setLocalStorage('register', {
          ...loginDetail,
          expiryTime: new Date(data.resendverifyOtpOtp.expiry?.expiresAt || 0).getTime()
        });
        successSnack(data?.resendverifyOtpOtp?.message || 'Code sent successfully. Please check your email');
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
