import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "loginecomm-bf2c2.firebaseapp.com",
    projectId: "loginecomm-bf2c2",
    storageBucket: "loginecomm-bf2c2.firebasestorage.app",
    messagingSenderId: "25479159097",
    appId: "1:25479159097:web:12cec66fc672fc11f19ce8"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()


export {auth , provider}

