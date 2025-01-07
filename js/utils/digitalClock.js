export function digitalClock() {
  const now = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const dateTimeString = `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  document.getElementById("clock").textContent = dateTimeString;
}

export function startClock() {
  digitalClock();
  setInterval(digitalClock, 1000);
}
