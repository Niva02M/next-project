import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPhone {
  dialCode: string;
  number: string;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber?: IPhone;
  deviceId?: string;
  status?: string;
  provider?: string;
  providerAccountId?: string;
  emailVerified?: boolean;
  createdAt?: Date;
}

const PhoneSchema = new Schema<IPhone>(
  {
    dialCode: { type: String },
    number: { type: String }
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phoneNumber: { type: PhoneSchema },
    deviceId: { type: String },
    status: { type: String, default: 'email_verification_pending' },
    provider: { type: String, default: 'local' },
    providerAccountId: { type: String },
    emailVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const User: Model<IUser> = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default User;
