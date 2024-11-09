import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCmXk3ZBMJ-or_IiTFCN4LOnvstpcfQwBI",
  authDomain: "grow-v2-d06b7.firebaseapp.com",
  projectId: "grow-v2-d06b7",
  storageBucket: "grow-v2-d06b7.appspot.com",
  messagingSenderId: "115811593555",
  appId: "1:115811593555:web:e0ec9c88c0ac6e6492c5a6",
  measurementId: "G-TYLV89XWQK",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);

auth.useDeviceLanguage();
