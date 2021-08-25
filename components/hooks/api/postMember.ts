export const createMember = async (data: {}) => {
  const res = await fetch('/api/departments/members', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(r => r.json());
  return res;
};
