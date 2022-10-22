export function formatDateTimeFromNow(date: Date): string {
  const secondsPast =
    (Date.parse(new Date().toDateString()) - Date.parse(date.toDateString())) /
    1000;

  if (secondsPast < 60) return "now";
  if (secondsPast < 3600) return Math.floor(secondsPast / 60) + "m";
  if (secondsPast < 24 * 3600) return date.getHours() + ":" + date.getMinutes();
  if (secondsPast < 365 * 24 * 3600)
    return date.getDate() + "/" + date.getMonth().toString().padStart(2, "0");

  return (
    date.getDate() +
    "/" +
    date.getMonth().toString().padStart(2, "0") +
    date.getFullYear()
  );
}
