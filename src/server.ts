import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
// import { JWT } from 'next-auth/jwt';
// import { jwtDecode } from 'jwt-decode';

import {
  LOGIN_MUTATION,
  FACEBOOK_SIGNIN_MUTATION
  //  GOOGLE_SIGNIN_MUTATION,
  // REFRESH_TOKEN_MUTATION
} from 'graphql/auth';
import { ISignInResponse, ISignInResponseFormat } from 'types/api-response/auth';
import client from '../apollo.config';

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
      clientId: process.env.NEXT_FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.NEXT_FACEBOOK_CLIENT_SECRET || '',
      profile: async (profile: any): Promise<any> => {
        const { id, name, email } = profile;
        const response = await client.mutate({
          mutation: FACEBOOK_SIGNIN_MUTATION,
          variables: {
            id,
            name,
            email
          }
        });
        if (response?.errors) {
          throw new Error(response?.errors[0].message);
        }
        if (response?.data) {
          const returnData = response?.data?.facebookAuthLogin;

          return {
            id: returnData?.user?._id || '',
            user: returnData?.user,
            access_token: returnData?.token?.accessToken,
            refresh_token: returnData?.token?.refreshToken,
            expires_at: returnData?.token?.accessTokenExpiresIn
          };
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET || '',
      profile: async (profile: any): Promise<any> => {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        const userDetail = user as ISignInResponseFormat;
        return {
          access_token: userDetail?.access_token,
          refresh_token: userDetail?.refresh_token,
          expires_at: userDetail?.expires_at,
          expiry: userDetail?.expiry,
          user: userDetail?.user
        };
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
