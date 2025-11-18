'use client';

import { GuardProps } from 'types';

// ==============================|| GUEST GUARD ||============================== //

/**
 * Guest guard for routes hniv231g no auth required
 * @param {PropTypes.node} children children element/node
 */

const GuestGuard = ({ children }: GuardProps) => {
  return children;
};

export default GuestGuard;
