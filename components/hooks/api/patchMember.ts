export const patchMember = async (data: {}) => {
  const res = await fetch(`/api/departments/members`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }).then(r => r.json());
  return res;
};
