export const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const formatDate = (dateString) => {
  const d = new Date(dateString + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const getDayName = (dateString) => {
  const d = new Date(dateString + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

export const isToday = (dateString) => {
  return dateString === getToday();
};