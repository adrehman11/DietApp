const admin = require('firebase-admin');

const serviceAccount = require("./dietCheat.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

const sendCustomNotification = async (title, description, token) => {
  const message = {
    token: token,
    notification: {
      title: title,
      body: description,
    },
    android: {
      notification: {
        sound: 'default',
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
        },
      },
    },
  };

  try {
    const response = await messaging.send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

module.exports = { messaging, sendCustomNotification };