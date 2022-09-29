// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDpG_pQXOY1l9LpLNKmowdoySWzIULCXMQ",
    authDomain: "dustecosystem.firebaseapp.com",
    projectId: "dustecosystem",
    storageBucket: "dustecosystem.appspot.com",
    messagingSenderId: "102907397114",
    appId: "1:102907397114:web:fa515568347cc4ead09a43",
    measurementId: "G-GVLTB2386N"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };