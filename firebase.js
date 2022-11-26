import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


const firebaseConfig = {
    apiKey: "AIzaSyBLc1XLIGEB0MRqJh1oTGkBSrVu-HnaFbA",
    authDomain: "linkedin-clone-a32b9.firebaseapp.com",
    projectId: "linkedin-clone-a32b9",
    storageBucket: "linkedin-clone-a32b9.appspot.com",
    messagingSenderId: "383360342037",
    appId: "1:383360342037:web:676dae61eac60b8cef161c",
    measurementId: "G-23KY14FNVB"
  };
  
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();
  const storage = firebase.storage();
  
  export { auth, provider, storage };
  export default db;
  