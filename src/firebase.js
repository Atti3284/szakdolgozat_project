// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-C3zqkKDU2s54fwI6r650kf7E3i0hAIA",
  authDomain: "edulearn-project-45579.firebaseapp.com",
  projectId: "edulearn-project-45579",
  storageBucket: "edulearn-project-45579.firebasestorage.app",
  messagingSenderId: "447397556413",
  appId: "1:447397556413:web:380c6a22050756d95c07d4",
  measurementId: "G-E1FEY4R3H4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//Itt hozzuk létre és exportáljuk az Auth szolgáltatást
export const auth = getAuth(app);
export default app;