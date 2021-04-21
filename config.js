import * as firebase from 'firebase';

// firebase configuration
// Initializing connection to my database on firebase
const firebaseConfig = {
    apiKey: "AIzaSyCeMDl1utIvER536jaHgP0ZwWjRGE1dFCU",
    authDomain: "mobiiliapp-bdbee.firebaseapp.com",
    databaseURL: "https://mobiiliapp-bdbee.firebaseio.com",
    projectId: "mobiiliapp-bdbee",
    storageBucket: "mobiiliapp-bdbee.appspot.com",
    messagingSenderId: "365271537003",
    appId: "1:365271537003:web:d62f519af168b06414282e",
    measurementId: "G-Q41TKJDNYH"
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}