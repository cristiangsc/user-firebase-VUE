import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { firebaseConfig } from "@/firebase/firebeConf";
initializeApp(firebaseConfig);
export const db = getFirestore();