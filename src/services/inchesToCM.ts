export const inchesToMM = (inches: number, decimals = 2): number => {
  return Number((inches * 25.4).toFixed(decimals));
};
