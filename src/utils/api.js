export const unwrapData = (response) => response.data?.data ?? response.data;

export const unwrapItems = (response) => {
  const data = unwrapData(response);
  if (Array.isArray(data)) {
    return data;
  }

  return data?.items || data?.stories || data?.users || data?.logs || [];
};

export const readMessage = (error, fallback) => {
  return error?.response?.data?.error?.message || error?.response?.data?.message || fallback;
};

export const getEntityId = (entity) => {
  if (entity === null || entity === undefined) return null;
  if (typeof entity === 'string' || typeof entity === 'number') return String(entity);
  return entity?._id || entity?.id || entity?.storyId || entity?.userId || null;
};