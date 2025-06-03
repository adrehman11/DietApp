const firebase = require('firebase-admin');

var serviceAccount = require("./dietCheat.json");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});


const messaging = firebase.messaging();

const sendCustomNotification = (title, description, token) => {
    let payload = {
        notification: {
            title: title,
            body: description,
            sound: 'default'
        }
    }

    messaging.sendToDevice(token, payload)
};


module.exports = { messaging, sendCustomNotification };

