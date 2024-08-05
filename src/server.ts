import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
// import { JWT } from 'next-auth/jwt';
// import { jwtDecode } from 'jwt-decode';

import {
  LOGIN_MUTATION,
  FACEBOOK_SIGNIN_MUTATION,
  GOOGLE_SIGNIN_MUTATION,
  REQUEST_PHONE_LOGIN_MUTATION,
  PHONE_LOGIN_WITH_OTP_MUTATION
  //  GOOGLE_SIGNIN_MUTATION,
  // REFRESH_TOKEN_MUTATION
} from 'graphql/auth';
import { ISignInResponse, ISignInResponseFormat } from 'types/api-response/auth';
import client from '../apollo.config';
import { use } from 'react';
// import { generateDeviceId } from 'utils/deviceid.helper';

export interface ILoginCredential {
  email: string;
  password: string;
  deviceId?: string;
}
export interface IDecodedToken {
  username: string;
  sub: string;
  registrationStatus: string;
  jti: string;
}

export interface IPhoneLoginCredential {
  phoneNumber: string;
  dialCode: string;
  deviceId: string;
}


export interface IPhoneLoginVerifyCredential extends IPhoneLoginCredential {
  verificationCode: string;
  expiryTime?: number;
}

// async function refreshAccessToken(tokenObject: any) {
//   try {
//     const { data } = await client.mutate({
//       mutation: REFRESH_TOKEN_MUTATION,
//       variables: {
//         refreshToken: tokenObject.refresh_token
//       }
//     });

//     return {
//       expires_at: data?.refresh?.accessTokenExpiresIn,
//       refresh_token: data?.refresh?.refreshToken,
//       access_token: data?.refresh?.accessToken
//     };
//   } catch (error) {
//     throw new Error('RefreshTokenError');
//   }
// }

const handleProvider = async (account: any, user:any) => {
  switch (account?.provider) {
    case 'google':
      try {
        const responseGoogle = await client.mutate({
          mutation: GOOGLE_SIGNIN_MUTATION,
          variables: {
            idToken: account.id_token,
            deviceId: '123456'
          }
        });
        if (responseGoogle?.errors) {
          throw new Error(responseGoogle?.errors[0].message);
        }
        if (responseGoogle?.data) {
          const returnData = responseGoogle?.data?.loginWithGoogle;
          const obj= {
            id: returnData?.user?._id || '',
            user: returnData?.user,
            access_token: returnData?.token?.accessToken,
            refresh_token: returnData?.token?.refreshToken,
            expires_at: returnData?.token?.accessTokenExpiresIn
          };
          // user['retrunData']=obj;
        }
      } catch (error) {
        console.error('Google sign-in error:', error);
        return false;
      }
      break;
    case 'facebook':
      try {
        const responseFacebook = await client.mutate({
          mutation: FACEBOOK_SIGNIN_MUTATION,
          variables: {
            accessToken: account.access_token,
            deviceId: '123456'
          }
        });
        if (responseFacebook?.errors) {
          throw new Error(responseFacebook?.errors[0].message);
        }
        if (responseFacebook?.data) {
          const returnData = responseFacebook?.data?.loginWithFacebook;

          return {
            id: returnData?.user?._id || '',
            user: returnData?.user,
            access_token: returnData?.token?.accessToken,
            refresh_token: returnData?.token?.refreshToken,
            expires_at: returnData?.token?.accessTokenExpiresIn
          };
        }
      } catch (error) {
        console.error('Facebook sign-in error:', error);
        return false;
      }
      break;
    // Add more cases here for other providers
    default:
      return false;
  }
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  // secret: process.env.NEXTAUTH_SECRET,
  secret: 'secretKeyForNextAuth',
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password, deviceId } = credentials as ILoginCredential;
        try {
          const res = await client.mutate<{ loginWithEmailPassword: ISignInResponse }>({
            mutation: LOGIN_MUTATION,
            variables: {
              body: {
                email,
                password,
                deviceId
              }
            }
          });

          if (res?.errors) {
            throw new Error(res?.errors[0].message);
          }

          if (res?.data?.loginWithEmailPassword?.token) {
            const data = res.data.loginWithEmailPassword;

            return {
              id: data.user?._id || '',
              user: data.user,
              access_token: data.token.accessToken,
              refresh_token: data.token.refreshToken,
              expires_at: data.token.accessTokenExpiresIn,
              emailVerified: data.user.status !== 'email_verification_pending'
            };
          }
          if (res?.data?.loginWithEmailPassword?.user?.status === 'email_verification_pending') {
            const data = res.data.loginWithEmailPassword;
            return {
              id: data?.user?._id || '',
              user: data?.user,
              expiry: data?.expiry,
              emailVerified: false
            };
          }

          return null;
        } catch (error: any) {
          throw new Error(error);
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.NEXT_FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.NEXT_FACEBOOK_CLIENT_SECRET!
    }),
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    CredentialsProvider({
      id: 'phone-login',
      type: 'credentials',
      name: 'phone',
      credentials: {},
      async authorize(credentials, req) {
        console.log('credentials ====> ', req.body);
        if (!credentials) return null;

        const { phoneNumber, dialCode, deviceId, verificationCode } = credentials as IPhoneLoginVerifyCredential;
        try {
          const res = await client.mutate<{ phoneLoginWithOTP: ISignInResponse }>({
            mutation: PHONE_LOGIN_WITH_OTP_MUTATION,
            variables: {
              body: {
                verificationCode,
                number: phoneNumber,
                dialCode,
                deviceId
              }
            }
          });

          if (res?.errors) {
            throw new Error(res?.errors[0].message);
          }

          if (res?.data?.phoneLoginWithOTP?.message) {
            const data = res.data.phoneLoginWithOTP;
            return {
              id: data.user?._id || '',
              user: data.user,
              access_token: data.token.accessToken,
              refresh_token: data.token.refreshToken,
              expires_at: data.token.accessTokenExpiresIn
            };
          }

          return null;
        } catch (error: any) {
          throw new Error(error);
        }
      }
    })

  ],

  callbacks: {
    async signIn({ user, account, profile }: any) {
      const providerData = await handleProvider(account);
      if (providerData) {
        user.id = providerData.id;
        user.user = providerData.user;
        user.access_token = providerData.access_token;
        user.refresh_token = providerData.refresh_token;
        user.expires_at = providerData.expires_at;

        return true;
      }
      return true; // Deny sign-in
    },
    async jwt({ token, user }: any) {
      if (user && user.returnData) {
        const userDetail = user as ISignInResponseFormat;
        return {
          access_token: userDetail?.access_token,
          refresh_token: userDetail?.refresh_token,
          expires_at: userDetail?.expires_at,
          expiry: userDetail?.expiry,
          user: userDetail?.user,
          returnData: user.retrunData
        };
      } else {
        if (user) {
          return user.user;
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      session.user = token;
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};
