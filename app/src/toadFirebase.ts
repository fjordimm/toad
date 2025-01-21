import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
	apiKey: "AIzaSyByesNrYrupfSitTm_UlwaO01sibnzXsHg",
	authDomain: "toad-b0980.firebaseapp.com",
	projectId: "toad-b0980",
	storageBucket: "toad-b0980.firebasestorage.app",
	messagingSenderId: "925698547645",
	appId: "1:925698547645:web:0240fe1acb19231a353cd4",
	measurementId: "G-ZGVZB6M8K7"
};

export const firebaseApp = initializeApp(firebaseConfig);

export const firebaseDb = firebaseApp.firestore();
export const firebaseAuth = firebaseApp.auth();
export const firebaseAnalytics = getAnalytics(firebaseApp);
