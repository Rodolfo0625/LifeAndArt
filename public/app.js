// Registrar service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log("Service Worker registered ✅"))
    .catch(err => console.log("Service Worker failed ❌", err));
}

// Firebase config
const firebaseConfig = {
apiKey: "AIzaSyB2cS9leYKwzWJdnewcTPTejmc7Fg8T21c",
  authDomain: "lifeandart-f8c02.firebaseapp.com",
  projectId: "lifeandart-f8c02",
  storageBucket: "lifeandart-f8c02.firebasestorage.app",
  messagingSenderId: "312896657787",
  appId: "1:312896657787:web:deac98bf09b35ce50145de"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.requestPermission()
  .then(() => messaging.getToken())
  .then(token => console.log("FCM Token:", token))
  .catch(err => console.log("FCM error:", err));

// DOM elements
const remindersDiv = document.getElementById("reminders");
const welcomeScreen = document.getElementById("welcome-screen");
const appDiv = document.getElementById("app");

// Entrar a la app
function enterApp() {
  welcomeScreen.style.display = "none";
  appDiv.style.display = "block";
  renderReminders();
  requestNotificationPermission();
}

// Solicitar permiso de notificaciones
function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
      console.log(permission === "granted" ? "Notifications granted ✅" : "Notifications denied ❌");
    });
  }
}

// Guardar recordatorio
function saveReminder() {
  const title = document.getElementById("title").value;
  const datetime = document.getElementById("datetime").value;

  if (!title || !datetime) return alert("Please fill in all fields!");

  const reminder = { title, datetime, color: randomPastel() };
  let reminders = JSON.parse(localStorage.getItem("lifeandart")) || [];
  reminders.push(reminder);
  localStorage.setItem("lifeandart", JSON.stringify(reminders));

  renderReminders();
  scheduleNotification(reminder);
  launchConfetti();
}

// Notificación local
function scheduleNotification(reminder) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const delay = new Date(reminder.datetime).getTime() - Date.now();
  if (delay <= 0) return;
  setTimeout(() => {
    new Notification("LifeAndArt Reminder 💌", { body: reminder.title, icon: "/icons/icon-192.png" });
    launchConfetti();
  }, delay);
}

// Renderizar recordatorios
function renderReminders() {
  let reminders = JSON.parse(localStorage.getItem("lifeandart")) || [];
  remindersDiv.innerHTML = "";
  reminders.forEach(r => {
    const div = document.createElement("div");
    div.className = "reminder-card";
    div.style.background = r.color;
    div.innerHTML = `<strong>${r.title}</strong><br>${new Date(r.datetime).toLocaleString()}`;
    animateCard(div);
    remindersDiv.appendChild(div);
  });
}

// Animación tarjeta
function animateCard(div) {
  div.style.transform = "scale(0.9)";
  setTimeout(() => div.style.transform = "scale(1)", 100);
}

// Color pastel aleatorio
function randomPastel() {
  const r = Math.floor(Math.random()*127 + 128);
  const g = Math.floor(Math.random()*127 + 128);
  const b = Math.floor(Math.random()*127 + 128);
  return `rgba(${r},${g},${b},0.7)`;
}

// Confetti
function launchConfetti() {
  confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
}

// Programar notificaciones de recordatorios guardados al cargar
window.addEventListener("load", () => {
  let reminders = JSON.parse(localStorage.getItem("lifeandart")) || [];
  reminders.forEach(r => scheduleNotification(r));
});