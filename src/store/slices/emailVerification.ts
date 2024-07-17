// third-party
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type OTPType = {
  email: string;
  password: string;
  forgotPassword?: ForgotPasswordType;
};

type ForgotPasswordType = {
  email?: string;
  expiresBy?: number;
  expiresAt?: number;
  deviceId?: string;
  otp?: string;
};

const initialState: OTPType = {
  email: '',
  password: '',
  forgotPassword: {
    email: '',
    expiresBy: 0,
    expiresAt: 0,
    deviceId: '',
    otp: ''
  }
};
const slice = createSlice({
  name: 'emailVerification',
  initialState,
  reducers: {
    setLoginDetail(state, action: PayloadAction<OTPType>) {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    setForgotPasswordDetail(state, action: PayloadAction<ForgotPasswordType>) {
      return { ...state, forgotPassword: { ...action.payload } };
    },
    setForgotPasswordOTP(state, action: PayloadAction<string>) {
      return { ...state, forgotPassword: { ...state.forgotPassword, otp: action.payload } };
    },
    clearForgotPasswordDetail(state) {
      return { ...state, forgotPassword: initialState.forgotPassword };
    },
    setForgotPasswordTime(state, action: PayloadAction<{ expiresBy: number; expiresAt: number }>) {
      return {
        ...state,
        forgotPassword: {
          ...state.forgotPassword,
          expiresAt: action.payload.expiresAt,
          expiresBy: action.payload.expiresBy
        }
      };
    }
  }
});

// Reducer
export default slice.reducer;

export const { setLoginDetail, setForgotPasswordDetail, setForgotPasswordOTP, clearForgotPasswordDetail, setForgotPasswordTime } =
  slice.actions;
