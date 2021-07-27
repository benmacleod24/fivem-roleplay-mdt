const useChargeColor = (chargeColor: string | null) => {
  switch (chargeColor) {
    case 'infraction':
      return 'blue.300';
    case 'misdemeanor':
      return 'orange';
    case 'felony':
      return 'red';
    default:
      return;
  }
};

export default useChargeColor;
