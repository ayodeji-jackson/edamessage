export function formatDateTimeFromNow(date: Date): string {
  const secondsPast =
    (Date.parse(new Date().toString()) - Date.parse(date.toDateString())) /
    1000;

  if (secondsPast < 24 * 3600)
    return addZero(date.getHours()) + ":" + addZero(date.getMinutes());
  if (secondsPast < 365 * 24 * 3600)
    return addZero(date.getDate()) + "/" + addZero(date.getMonth());

  return (
    addZero(date.getDate()) +
    "/" +
    addZero(date.getMonth()) +
    date.getFullYear()
  );
}

function addZero(exp: any) {
  return exp.toString().padStart(2, "0");
}
