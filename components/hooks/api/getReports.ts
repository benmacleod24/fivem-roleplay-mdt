export const getReports = async () => {
  const res = await fetch(`/api/reports/`, {
    method: 'GET',
  }).then(r => r.json());
  return res;
};
