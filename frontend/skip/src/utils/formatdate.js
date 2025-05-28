export const formatDate = (isoString) => {
  if (!isoString) return '날짜 없음';
  const date = new Date(isoString);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}시${pad(date.getMinutes())}분`;
};

export const formatDate1 = (isoString) => {
  if (!isoString) return '날짜 없음';
  const date = new Date(isoString);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
