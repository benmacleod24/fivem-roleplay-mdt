export const createBooking = async (data: {}) => {
  const res = await fetch('/api/booking', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(r => r.json());
  return res;
};
