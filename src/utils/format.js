export const formatDate = (value) => {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

export const formatLabel = (value) => value?.replaceAll('_', ' ') || '—';

export const initials = (firstName = '', lastName = '') => {
  return `${firstName.slice(0, 1)}${lastName.slice(0, 1)}`.toUpperCase() || 'AK';
};