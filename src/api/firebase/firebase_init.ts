import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyByTn_rHX85l9glkJj8AqUY5uNWNK1aA40",
  authDomain: "truevoice-ff4da.firebaseapp.com",
  projectId: "truevoice-ff4da",
  storageBucket: "truevoice-ff4da.firebasestorage.app",
  messagingSenderId: "65856361505",
  appId: "1:65856361505:web:8a053bd2bb6c233eb1bf60",
  measurementId: "G-0RLGG06G70",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    "6LcUWXoqAAAAAJaJt24UvJhvqNb1sJTzU1t2Gt8b"
  ),
  isTokenAutoRefreshEnabled: true,
});

auth.useDeviceLanguage();
