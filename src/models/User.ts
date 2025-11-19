// @ts-nocheck
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPhone {
  dialCode: string;
  number: string;
}

export type UserStatus = 'email_verification_pending' | 'verified';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber?: IPhone;
  deviceId?: string;
  image?: string;
  status: UserStatus;
  otp?: string;
  otpExpiry?: Date;
  provider?: string;
  providerAccountId?: string;
  emailVerified?: boolean;
  createdAt?: Date;
}

export interface GraphQLContext {
  req: Request;
  user?: IUser | null;
}

const PhoneSchema = new Schema(
  {
    dialCode: { type: String },
    number: { type: String }
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phoneNumber: { type: PhoneSchema },
    deviceId: { type: String },

    status: {
      type: String,
      enum: ['email_verification_pending', 'verified'],
      default: 'email_verification_pending'
    },

    otp: { type: String },
    otpExpiry: { type: Date },

    provider: { type: String, default: 'credentials' },
    providerAccountId: { type: String },

    emailVerified: { type: Boolean, default: false },
    image: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
