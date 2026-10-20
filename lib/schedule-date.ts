// Le site est français : les dates programmées s'affichent toujours à l'heure de Paris,
// identiques au rendu serveur (UTC) et dans le navigateur.
const scheduleFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

export function formatScheduledAt(date: Date) {
  return scheduleFormatter.format(date);
}

// Valeur d'un <input type="datetime-local"> (heure locale du navigateur)
export function toDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
