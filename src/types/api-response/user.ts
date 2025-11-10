// import { IPhone } from 'types/api-inputs/auth';
interface ICordinates {
  lat?: string;
  long?: string;
}
interface ILocation {
  city?: string;
  coordinates?: ICordinates;
  country?: string;
  displayAddress?: string;
  postalCode?: string;
  state?: string;
  street?: string;
  type?: string;
}
interface IAddress {
  displayAddress: string;
  location: ILocation;
}
interface IEmail {
  email: string;
  isVerified: string;
}
interface IContacts {
  emailDetail: IEmail;
  // phone?: IPhone;
  phone?: string;
}

interface IAboutYou {
  aboutMe: string;
  experienceAndAchievement: string;
  qualifications: string;
  serviceAffiliation: string[];
  specialities: string[];
}

interface IIdentityDetail {
  cardNumber: string;
  identitySource: string;
  validUpto: Date;
}

interface IConsultationFee {
  followUpFee: number;
  initialFee: number;
}

// interface IMeResponse {
//   _id: string;
//   authProvider: string;
//   authProviderId: string;
//   contacts: IContacts;
//   address: IAddress;
//   firstName: string;
//   lastLoggedInAt: Date;
//   lastName: string;
//   image: string;
//   profileImageUrl: string;
//   status: string;
//   therapistProfile?: {
//     arcapNumber: string;
//     certificates: string[];
//     medicareCardNumber: string;
//     medicareCardValidity: Date;
//     practice: string;
//     practiceId?: string;
//     title: string;
//     aboutYou?: IAboutYou;
//     consultationFee?: IConsultationFee;
//     identityDetail?: IIdentityDetail;
//   };
//   bio: string;
//   timeZone: string | null;
// }
interface IMeResponse {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  provider: string;
  status: string;
  profileImageUrl?: string;
}

interface IPractices {
  title: string;
  _id: string;
}
interface ITherapistPracticeRes {
  therapistPractices: IPractices[];
}

interface IAllowedTimezones {
  _id: string;
  timezone: string;
}

interface IAllowedTimezonesResponse {
  data: IAllowedTimezones[];
}

export type {
  IMeResponse,
  ICordinates,
  ILocation,
  IAddress,
  IEmail,
  IContacts,
  IAboutYou,
  IIdentityDetail,
  IConsultationFee,
  ITherapistPracticeRes,
  IAllowedTimezones,
  IAllowedTimezonesResponse
};
