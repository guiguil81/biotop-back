const fixNumber = (number: number | string) => {
  if (typeof number === 'string') {
    return Math.round(parseInt(number, 10));
  }
  return Math.round(number);
};

export default fixNumber;
