import { gql, useMutation } from '@apollo/client';

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
  mutation loginWithFacebook($body: LoginFacebookInput!) {
    loginWithFacebook(body: $body) {
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

export const GOOGLE_SIGNIN_MUTATION = gql`
  mutation loginWithGoogle($body: LoginGoogleInput!) {
    loginWithGoogle(body: $body) {
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

export const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($body: VerifyEmailInput!) {
    verifyEmail(body: $body) {
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
  mutation resendVerifyEmailOtp($body: ResendEmailOtpInput!) {
    resendVerifyEmailOtp(body: $body) {
      expiry {
        expiresAt
        expiresBy
      }
      message
    }
  }
`;
