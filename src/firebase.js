// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyB3uh6iOZbUQqVjFFG_YmrlaJSDpM-dS6Q",
    authDomain: "clone-6378b.firebaseapp.com",
    projectId: "clone-6378b",
    storageBucket: "clone-6378b.appspot.com",
    messagingSenderId: "15501730540",
    appId: "1:15501730540:web:58083975d035f44a8f7bc9",
    measurementId: "G-GY4C53ZYPJ"
  };

 const firebaseApp = firebase.initializeApp(firebaseConfig);

 //initialize firebase database
 const db = firebaseApp.firestore();
 //initializee auth 
 const auth = firebase.auth();

 export {db, auth};