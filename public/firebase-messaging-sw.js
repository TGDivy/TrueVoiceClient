/* eslint-env serviceworker */

importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../firebase-messaging-sw.js")
    .then(function (registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function (err) {
      console.log("Service worker registration failed, error:", err);
    });
}

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyCmXk3ZBMJ-or_IiTFCN4LOnvstpcfQwBI",
  authDomain: "grow-v2-d06b7.firebaseapp.com",
  projectId: "grow-v2-d06b7",
  storageBucket: "grow-v2-d06b7.appspot.com",
  messagingSenderId: "115811593555",
  appId: "1:115811593555:web:e0ec9c88c0ac6e6492c5a6",
  measurementId: "G-TYLV89XWQK",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "favicon.ico",
    // open URL on notification click
    data: {
      url: payload.data.url,
    },
    actions: [
      {
        action: "open_url",
        title: "Open",
      },
    ],
    click_action: payload.data.url,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  console.log("On notification click: ", event);
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
