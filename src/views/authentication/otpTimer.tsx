import React from 'react';

const OTPTimer = ({ remainingTime }: any) => {
  const formatTime = (timeInSeconds: any) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  return (
    <div>
      {remainingTime > 0 ? (
        <p style={{ textAlign: 'center', color: '#757575' }}>OTP will expire in: {formatTime(remainingTime)}</p>
      ) : (
        <p style={{ textAlign: 'center', color: '#f32828' }}>OTP has expired.</p>
      )}
    </div>
  );
};

export default OTPTimer;
