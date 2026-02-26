importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
 apiKey: "AIzaSyB2cS9leYKwzWJdnewcTPTejmc7Fg8T21c",
  authDomain: "lifeandart-f8c02.firebaseapp.com",
  projectId: "lifeandart-f8c02",
  storageBucket: "lifeandart-f8c02.firebasestorage.app",
  messagingSenderId: "312896657787",
  appId: "1:312896657787:web:deac98bf09b35ce50145de"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[FCM] Background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});