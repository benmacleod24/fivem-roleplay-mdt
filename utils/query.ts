export const toQuery = (params: Record<string, string>): string => {
  Object.entries(params).map(([k, v]) => {
    if (!v) {
      delete params[k];
    }
  });
  return new URLSearchParams(params).toString();
};
