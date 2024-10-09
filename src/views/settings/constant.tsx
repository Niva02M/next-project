import Amex from 'assets/payment/amex';
import Bank from 'assets/payment/bank';
import Base from 'assets/payment/base';
import Jcb from 'assets/payment/jcb';
import Master from 'assets/payment/master';
import Unionpay from 'assets/payment/unionpay';
import Visa from 'assets/payment/visa';

export const settingsTabOption = [
  {
    label: 'Edit settings',
    url: '/setting'
  },
  {
    label: 'Payment settings',
    url: '/setting/payment'
  }
];

export const PAYMENT_TYPE = 'Payment type';
export const PAYMENT_DETAILS = 'Payment details';
export const ADD_PAYMENT_DETAIL = 'Add payment detail';
export const ADD_PAYMENT_DETAILS = 'Add payment details';
export const PAYMENT_SETTINGS = 'Payment settings';
export const DELETE_CARD_MESSAGE = 'Deleting payment method will not allow you to use this payment method in future.';
export const DELETE_CARD = 'Delete payment method';
export const DEFAULT_CARD_TITLE = 'Update default payment method';
export const DEFAULT_CARD_DESCRIPTION = 'Default payment method will be updated.';

export const RenderCard = ({ card }: { card: string }) => {
  switch (card) {
    case 'visa':
      return <Visa />;

    case 'mastercard':
      return <Master />;

    case 'amex':
      return <Amex />;

    case 'jcb':
      return <Jcb />;

    case 'unionpay':
      return <Unionpay />;

    case 'au_becs_debit':
      return <Bank />;

    default:
      return <Base />;
  }
};
