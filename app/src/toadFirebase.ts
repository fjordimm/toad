/*
 Description:
  The API keys and initializer for Firebase functionality.
 
 Interactions:
  - Should almost exclusively be used by databaseUtil.ts, with few exceptions.
*/

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyByesNrYrupfSitTm_UlwaO01sibnzXsHg",
    authDomain: "toad-b0980.firebaseapp.com",
    projectId: "toad-b0980",
    storageBucket: "toad-b0980.firebasestorage.app",
    messagingSenderId: "925698547645",
    appId: "1:925698547645:web:0240fe1acb19231a353cd4",
    measurementId: "G-ZGVZB6M8K7"
};

const firebaseApp = initializeApp(firebaseConfig);

export const firebaseDb = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
