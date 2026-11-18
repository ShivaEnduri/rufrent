// // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBNDZuso7FyU3PdqWsNOlAPmUdAEggsUSw",
  authDomain: "rufrent-d83b1.firebaseapp.com",
  projectId: "rufrent-d83b1",
  storageBucket: "rufrent-d83b1.firebasestorage.app",
  messagingSenderId: "484664317541",
  appId: "1:484664317541:web:e8e855e334a690b2a5188c",
  measurementId: "G-G9RQE72MW1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); // Google Auth Provider


// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyBNDZuso7FyU3PdqWsNOlAPmUdAEggsUSw",
//   authDomain: "rufrent-d83b1.firebaseapp.com",
//   projectId: "rufrent-d83b1",
//   storageBucket: "rufrent-d83b1.appspot.com",
//   messagingSenderId: "484664317541",
//   appId: "1:484664317541:web:e8e855e334a690b2a5188c",
//   measurementId: "G-G9RQE72MW1",
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();
// export { RecaptchaVerifier };


// firebase.js (clean version for rufrent-dev)

// // firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyB06JxTvyZaFmMYZn5_ljH4I2qULItAYow",
//   authDomain: "rufrent-dev.firebaseapp.com",
//   projectId: "rufrent-dev",
//   storageBucket: "rufrent-dev.firebasestorage.app",
//   messagingSenderId: "607879093602",
//   appId: "1:607879093602:web:fa4e079f6fa842dd8ba03b",
//   measurementId: "G-CFVJQRZ66T"
// };

// // ✅ Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // ✅ Create authentication instance
// export const auth = getAuth(app);

// // ✅ Google provider
// export const googleProvider = new GoogleAuthProvider();
