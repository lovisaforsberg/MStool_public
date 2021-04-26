import firebase from 'firebase';
import '@firebase/auth';

const Config = {
    apiKey: 'AIzaSyC9qc3xa8QVw8QaQZxPYPrxFlxvpjnAwvg',
    authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_FIREBASE_APPID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID
  };

  const fire = firebase.initializeApp(Config)

  export default fire