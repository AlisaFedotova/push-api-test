// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    messagingSenderId: '301131752481'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    payload.data.data = JSON.parse(JSON.stringify(payload.data));

    return self.registration.showNotification(payload.data.title, payload.data);
});