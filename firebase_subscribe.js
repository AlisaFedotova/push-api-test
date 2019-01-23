// Initialize Firebase
var config = {
    apiKey: "AIzaSyCU2dJfUV41uV-Zv-jh3RhZM17eGNix3oI",
    authDomain: "push-api-test-65c23.firebaseapp.com",
    databaseURL: "https://push-api-test-65c23.firebaseio.com/",
    projectId: "push-api-test-65c23",
    storageBucket: "",
    messagingSenderId: "301131752481"
};
firebase.initializeApp(config);


// браузер поддерживает уведомления
// вообще, эту проверку должна делать библиотека Firebase, но она этого не делает
if ('Notification' in window) {
    var messaging = firebase.messaging();

    messaging.usePublicVapidKey(
        'BD7Hofb6Xm9wZSStXm0boGji3k2IBCNMritja4mK7XcllyxyJeeO2pKFExd0tC5EvdbcNhG-TYobqrvmVK4owCI');

    navigator.serviceWorker.register('firebase-messaging-sw.js')
             .then(function (reg) {
                 messaging.useServiceWorker(reg);
                 // подписываем на уведомления если ещё не подписали
                 if (Notification.permission === 'granted') {
                     subscribe();

                 }

                 // по клику, запрашиваем у пользователя разрешение на уведомления
                 // и подписываем его

                 document.querySelector('#subscribe').addEventListener('click', function () {
                     Notification.requestPermission(
                         function (status) {
                             console.log('Notification permition status:', status);
                         });
                 });
             })

}

function subscribe() {
    // запрашиваем разрешение на получение уведомлений
    messaging.requestPermission()
             .then(function () {
                 console.log('Have permission');
                 // получаем ID устройства
                 messaging.getToken()
                          .then(function (currentToken) {
                              if (currentToken) {
                                  sendTokenToServer(currentToken);
                              } else {
                                  console.warn('Не удалось получить токен.  ');
                                  setTokenSentToServer(false);
                              }
                          })
                          .catch(function (err) {
                              console.warn('При получении токена произошла ошибка.', err);
                              setTokenSentToServer(false);
                          });

             })
             .catch(function (err) {
                 console.log(('Error: Have no permission'));
             });
}

// отправка ID на сервер
function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer(currentToken)) {
        console.log('Отправка токена на сервер...');

        var url = 'firebase_subscribe.js'; // адрес скрипта на сервере который сохраняет ID устройства
        let data = new FormData();
        data.append('token', currentToken);
        fetch(url, {
            method: 'POST',
            body: data
        }).then(function (e) {
            console.log(e);
        });
        setTokenSentToServer(currentToken);
    } else {
        console.log('Токен уже отправлен на сервер.');
    }
}

// используем localStorage для отметки того,
// что пользователь уже подписался на уведомления
function isTokenSentToServer(currentToken) {
    return window.localStorage.getItem('sentFirebaseMessagingToken') === currentToken;
}

function setTokenSentToServer(currentToken) {
    window.localStorage.setItem(
        'sentFirebaseMessagingToken',
        currentToken ? currentToken : ''
    );

}