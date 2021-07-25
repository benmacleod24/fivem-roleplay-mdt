export const patchReport = async (reportId: string, data: {}) => {
  const res = await fetch(`/api/reports/${reportId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }).then(r => r.json());
  return res;
};
