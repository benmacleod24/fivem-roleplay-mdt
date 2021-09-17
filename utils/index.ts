const numberWithComma = (number: any): string =>
  (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')) ?? 'should be a number here';

export { numberWithComma };
export default {
  numberWithComma,
};
