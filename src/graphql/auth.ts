import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation registerUser($input: SignupInput!) {
    registerUser(body: $input) {
      message
      expiry {
        expiresBy
        expiresAt
      }
      user {
        _id
        email
        status
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation loginWithEmailPassword($body: LoginEmailPasswordInput!) {
    loginWithEmailPassword(body: $body) {
      message
      expiry {
        expiresBy
        expiresAt
      }
      token {
        accessToken
        accessTokenExpiresIn
        refreshToken
        refreshTokenExpiresIn
      }
      user {
        _id
        email
        status
      }
    }
  }
`;

export const FACEBOOK_SIGNIN_MUTATION = gql`
  mutation LoginWithFacebook($accessToken: String!, $deviceId: String!) {
    loginWithFacebook(accessToken: $accessToken, deviceId: $deviceId) {
      message
      token {
        accessToken
        accessTokenExpiresIn
        refreshToken
        refreshTokenExpiresIn
      }
      user {
        _id
        cometAuthToken
        email
        loginType
      }
    }
  }
`;

export const GOOGLE_SIGNIN_MUTATION = gql`
  mutation LoginWithGoogle($idToken: String!, $deviceId: String!) {
    loginWithGoogle(idToken: $idToken, deviceId: $deviceId) {
      message
      token {
        accessToken
        accessTokenExpiresIn
        refreshToken
        refreshTokenExpiresIn
      }
      user {
        _id
        cometAuthToken
        email
        loginType
      }
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation forgotPassword($body: ForgotPasswordInput!) {
    forgotPassword(body: $body) {
      message
      expiry {
        expiresAt
        expiresBy
      }
    }
  }
`;

export const VERIFY_FORGOT_PASSWORD_OTP_MUTATION = gql`
  mutation verifyResetPasswordOTP($body: VerifyResetPasswordOtpInput!) {
    verifyResetPasswordOTP(body: $body) {
      message
    }
  }
`;

export const VERIFY_OTP_MUTATION = gql`
  mutation verifyOtp($body: VerifyOtpInput!) {
    verifyOtp(body: $body) {
      message
      expiry {
        expiresAt
        expiresBy
      }
      token {
        accessToken
        accessTokenExpiresIn
        refreshToken
        refreshTokenExpiresIn
      }
      user {
        _id
        email
        status
      }
    }
  }
`;

export const RESEND_VERIFY_EMAIL_OTP_MUTATION = gql`
  mutation ResendVerifyOtp($body: ResendVerifyOtpInput!) {
    resendVerifyOtp(body: $body) {
      message
      expiry {
        expiresAt
        expiresBy
      }
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword($body: ResetPasswordInput!) {
    resetPassword(body: $body) {
      message
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refresh(refreshToken: $refreshToken) {
      accessToken
      accessTokenExpiresIn
      refreshToken
      refreshTokenExpiresIn
    }
  }
`;

export const REQUEST_PHONE_LOGIN_MUTATION = gql`
  mutation RequestPhoneLoginOTP($body: RequestPhoneLoginOTPInput!) {
    requestPhoneLoginOTP(body: $body) {
      expiry {
        expiresAt
        expiresBy
      }
      message
    }
  }
`;

export const PHONE_LOGIN_WITH_OTP_MUTATION = gql`
  mutation PhoneLoginWithOTP($body: PhoneLoginWithOTPInput!) {
    phoneLoginWithOTP(body: $body) {
      token {
        accessToken
        accessTokenExpiresIn
        refreshToken
        refreshTokenExpiresIn
      }
      user {
        _id
        cometAuthToken
        email
        loginType
      }
      message
    }
  }
`;
