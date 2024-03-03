const admin = require('firebase-admin');
const serviceAccount = require("rail-tickets-base-firebase-adminsdk-wrfzx-d359561959.json"); // Putanja do vašeg servisnog ključa

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://rail-tickets-base-default-rtdb.europe-west1.firebasedatabase.app' //   URL projekta
});

const uid = 'i8A3A76mnaS6IOGmNOKc38M8p8Z2'; // UID korisnika 
const claims = {
  isAdmin: true // Postavljamo Custom Claim "isAdmin" na true
};

admin
  .auth()
  .setCustomUserClaims(uid, claims)
  .then(() => {
    console.log('Custom Claim "isAdmin" je uspešno postavljen za korisnika.');
  })
  .catch((error) => {
    console.error('Greška prilikom postavljanja Custom Claim:', error);
  });
