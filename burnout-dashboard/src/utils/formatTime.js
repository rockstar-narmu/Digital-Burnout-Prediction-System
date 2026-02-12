export default function formatTime(sec) {
  if (!sec || sec < 60) return `${sec} sec`;

  const minutes = Math.floor(sec / 60);
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMin = minutes % 60;

  return `${hours} hr ${remainingMin} min`;
}
