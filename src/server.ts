import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';
import { jwtDecode } from 'jwt-decode';

import { LOGIN_MUTATION, FACEBOOK_SIGNIN_MUTATION, GOOGLE_SIGNIN_MUTATION } from 'graphql/auth';
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
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  // secret: process.env.NEXTAUTH_SECRET,
  secret: 'secretKeyForNextAuth',
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        // email: { label: 'Email', type: 'email' },
        // password: { label: 'Password', type: 'password' },
        // deviceId: { label: 'Device ID', type: 'text', optional: true }
        // accessToken: { label: 'Access Token', type: 'text', optional: true },
        // refreshToken: { label: 'Refresh Token', type: 'text', optional: true },
        // accessTokenExpiresIn: { label: 'Access Token Expires In', type: 'text', optional: true },
        // refreshTokenExpiresIn: { label: 'Refresh Token Expires In', type: 'text', optional: true },
        // user: { label: 'sSigned in user', type: 'object', optional: true },
        // _id: { label: 'user id', type: 'text', optional: true }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const {
          email,
          password,
          deviceId
          //  accessToken, accessTokenExpiresIn, refreshTokenExpiresIn, refreshToken, _id, user
        } = credentials as ILoginCredential;
        try {
          // if (accessToken && refreshToken && _id) {
          //   return {
          //     access_token: accessToken,
          //     refresh_token: refreshToken,
          //     id: _id,
          //     expires_at: accessTokenExpiresIn,
          //     refreshTokenExpiresIn,
          //     user
          //   };
          // }

          console.log(email, password, 5555555555555555);

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

          console.log(res, 66666666666666);

          if (res?.data?.loginWithEmailPassword?.token) {
            const data = res.data.loginWithEmailPassword;

            return {
              id: data.user?._id || '',
              user: data.user,
              access_token: data.token.accessToken,
              refresh_token: data.token.refreshToken,
              expires_at: data.token.accessTokenExpiresIn,
              mailVerified: data.user.status !== 'email_verification_pending'
            };
          }
          if (res.data?.loginWithEmailPassword?.user?.status === 'email_verification_pending') {
            return {
              id: res.data?.loginWithEmailPassword.user?._id || '',
              user: res.data?.loginWithEmailPassword.user,
              expiry: res.data?.loginWithEmailPassword.expiry,
              mailVerified: false
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
    async jwt({ token, account }: any) {
      console.log(77777777777, account);
      console.log(88888888888, token);
      let registrationStatus = '';
      const userDetail = account as ISignInResponseFormat;
      if (account) {
        if (account?.access_token) {
          registrationStatus = jwtDecode<IDecodedToken>(account.access_token)?.registrationStatus;
        }

        return {
          access_token: userDetail?.access_token,
          refresh_token: userDetail?.refresh_token,
          expires_at: userDetail?.expires_at,
          expiry: userDetail?.expiry,
          user: { ...userDetail.user, registrationStatus }
        };
      }
      return token;
    },

    async session({ session, token, user }) {
      console.log(token, 898989898);
      session.user = token;

      // Send properties to the client, like an access_token from a provider.

      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};
