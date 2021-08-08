export const patchImage = async (citizenId: string, data: {}) => {
  const res = await fetch(`/api/citizens/${citizenId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }).then(r => r.json());
  return res;
};
