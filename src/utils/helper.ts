const calculateRemainingTime = (expiryTime: any) => {
  try {
    if (typeof expiryTime != 'number' && typeof expiryTime != 'string') return undefined;
    const currentTime = new Date().getTime();
    const remainingTime = Math.max(0, Math.floor((Number(expiryTime) - currentTime) / 1000));
    return remainingTime;
  } catch (error) {
    return undefined;
  }
};

export { calculateRemainingTime };
