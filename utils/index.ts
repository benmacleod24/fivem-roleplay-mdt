const numberWithComma = (number: any): string => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export {numberWithComma}
export default {
    numberWithComma
}