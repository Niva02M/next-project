interface ISignedUrlDetail {
  url: string;
  message: string;
  fields: string;
}
interface IUploadProfileImage {
  uploadImageOrDocument: ISignedUrlDetail;
}

type UserStatus = 'email_verification_pending' | 'email_verified' | 'password_set' | 'password_set_pending';

// interface ICordinate {
//   lat: number;
//   lng: number;
// }
// interface ILocationResponse {
//   type: string;
//   displayAddress: number[];
//   coordinates: ICordinate;
//   country: string;
//   state: string;
//   city: string;
//   street: string;
//   postalCode: string;
// }
// interface IAdressResponse {
//   displayAddress?: string;
//   location: ILocationResponse;
// }
interface IUserPops {
  _id: string;
  email: string;
  status: UserStatus;
  // address?: IAdressResponse;
}
interface IToken {
  accessToken: string;
  accessTokenExpiresIn: Date;
  refreshToken: string;
  refreshTokenExpiresIn: Date;
}
interface ISignInResponse {
  message: string;
  token: IToken;
  user: IUserPops;
  expiry: {
    expiresAt: Date;
    expiresBy: number;
  };
}

interface ISignInResponseFormat extends Omit<ISignInResponse, 'token' | 'message'> {
  id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  emailVerified: boolean;
}

interface IExpiry {
  expiresBy: number;
  expiresAt: string;
}

interface IForgotpasswordFields {
  expiry?: any;
  message: string;
  data: IExpiry;
}

interface IForgotPasswordResponse {
  forgotPassword: IForgotpasswordFields;
}

interface ILoginUserResponse {
  _id: string;
  email: string;
  status: string;
}

interface IVerifyEmailResponse {
  expiry: IExpiry;
  message: string;
  token: IToken;
  user: ILoginUserResponse;
}

export type {
  IUploadProfileImage,
  ISignedUrlDetail,
  ISignInResponse,
  ISignInResponseFormat,
  IForgotPasswordResponse,
  IVerifyEmailResponse,
  IToken,
  ILoginUserResponse
};
