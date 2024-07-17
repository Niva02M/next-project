interface IForgotpasswordFields {
  email?: string;
  deviceId: string;
}

interface IVerifyForgotPasswordOtp {
  verificationCode: string;
  email?: string;
}

interface IForgotPassword extends IVerifyForgotPasswordOtp {
  password: string;
}

interface IVerifyEmail {
  email: string;
  verificationCode: string;
}

export type { IForgotpasswordFields, IVerifyForgotPasswordOtp, IForgotPassword, IVerifyEmail };
