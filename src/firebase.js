import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyClhGZ9T6I_sC5Crx0IGisO4VqGuDflqQg",
    authDomain: "blog-9d822.firebaseapp.com",
    projectId: "blog-9d822",
    storageBucket: "blog-9d822.appspot.com",
    messagingSenderId: "340894345727",
    appId: "1:340894345727:web:20d03c418e3327ec5b5fca",
    measurementId: "G-1X3KW7JPZP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };