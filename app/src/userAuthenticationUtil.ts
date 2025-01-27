import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc, type DocumentSnapshot } from "firebase/firestore";
import { firebaseDb } from "./toadFirebase";

export function authenticateUser(onUserAuthenticated: (result: DocumentSnapshot) => void) {
	onAuthStateChanged(getAuth(), (authUser: User | null) => {
		if (authUser !== null) {
			console.log("Bro is logged in:");

			const emailId: string = authUser.email as string;
			console.log(`Email: ${emailId}`);

			const docPromise: Promise<DocumentSnapshot> = getDoc(doc(firebaseDb, "users", emailId));
			docPromise.then((result: DocumentSnapshot) => {
				console.log(result.data()?.first_name);
			});
		} else {
			console.log("Bro is NOT logged in.");
		}
	});
}
