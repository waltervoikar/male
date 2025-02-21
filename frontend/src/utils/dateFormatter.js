export function formatDate(date) {
  if (date === null) {
    return "-"
  }
  return new Date(date).toISOString().split('T')[0];
}

// ChatGPT
export function formatTimestamp(dateStr) {
  if (dateStr === null) {
    return "-"
  }
  const date = new Date(dateStr);

  const pad = num => String(num).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are zero-indexed
  const day = pad(date.getDate());

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
