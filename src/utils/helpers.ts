export const generateProductNumber = (): string => {
  // Generate a random 5-digit number
  const min = 10000;
  const max = 99999;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};