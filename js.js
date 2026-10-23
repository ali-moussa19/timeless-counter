
"use strict";

// Date de départ : 18 août 2024 à minuit, heure locale.
const startDate = new Date(2024, 7, 18, 0, 0, 0);

// Récupération des éléments HTML.
const elements = {
  years: document.getElementById("years"),
  months: document.getElementById("months"),
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  currentDate: document.getElementById("current-date"),
  currentTime: document.getElementById("current-time"),
  timezone: document.getElementById("timezone"),
  yearNow: document.getElementById("year-now")
};

// Ajoute des mois en conservant l'heure et en évitant
// les débordements de date (par exemple le 31 février).
function addMonths(date, amount) {
  const target = new Date(
    date.getFullYear(),
    date.getMonth() + amount,
    1,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );

  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0
  ).getDate();

  target.setDate(Math.min(date.getDate(), lastDay));

  return target;
}

// Ajoute des jours calendaires en conservant l'heure locale.
function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

// Calcule années, mois, jours, heures, minutes et secondes.
function getElapsedTime(now) {
  if (now < startDate) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }

  let years = now.getFullYear() - startDate.getFullYear();
  let cursor = addMonths(startDate, years * 12);

  // Ajuste les années si l'anniversaire n'est pas encore passé.
  if (cursor > now) {
    years--;
    cursor = addMonths(startDate, years * 12);
  }

  let months =
    (now.getFullYear() - cursor.getFullYear()) * 12 +
    now.getMonth() - cursor.getMonth();

  let monthCursor = addMonths(cursor, months);

  if (monthCursor > now) {
    months--;
    monthCursor = addMonths(cursor, months);
  }

  cursor = monthCursor;

  let days = 0;

  // À ce stade, il reste au maximum quelques jours à compter.
  while (addDays(cursor, days + 1) <= now) {
    days++;
  }

  cursor = addDays(cursor, days);

  // Le reliquat correspond aux heures, minutes et secondes.
  let remaining = Math.max(0, now.getTime() - cursor.getTime());

  const hours = Math.floor(remaining / 3600000);
  remaining %= 3600000;

  const minutes = Math.floor(remaining / 60000);
  remaining %= 60000;

  const seconds = Math.floor(remaining / 1000);

  return { years, months, days, hours, minutes, seconds };
}

// Affiche un nombre sur au moins deux chiffres.
function pad(value) {
  return String(value).padStart(2, "0");
}

// Met à jour toute l'interface.
function updateClock() {
  const now = new Date();
  const elapsed = getElapsedTime(now);

  elements.years.textContent = elapsed.years;
  elements.months.textContent = elapsed.months;
  elements.days.textContent = elapsed.days;
  elements.hours.textContent = pad(elapsed.hours);
  elements.minutes.textContent = pad(elapsed.minutes);
  elements.seconds.textContent = pad(elapsed.seconds);

  elements.currentDate.textContent = now.toLocaleDateString(
    "fr-FR",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

  elements.currentTime.textContent = [
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join(":");

  // Indique le fuseau horaire utilisé par le navigateur.
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  elements.timezone.textContent = timezone || "HEURE LOCALE";

  elements.yearNow.textContent = now.getFullYear();
}

// Affiche immédiatement le résultat, puis actualise chaque seconde.
updateClock();
setInterval(updateClock, 1000);

// Recalcule immédiatement lorsque l'utilisateur revient sur l'onglet.
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    updateClock();
  }
});

window.addEventListener("pageshow", updateClock);
