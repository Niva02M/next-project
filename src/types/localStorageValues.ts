interface IRegisterValues {
  email: string;
  expiryTime?: number;
}

interface IForgotpasswordValues {
  email: string;
  expiresAt: number;
  deviceId: string;
  otp: string;
}

export type { IRegisterValues, IForgotpasswordValues };
