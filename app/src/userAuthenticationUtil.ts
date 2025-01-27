import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc, type DocumentSnapshot } from "firebase/firestore";
import { firebaseDb } from "./toadFirebase";

export function authenticateUser(onAuthenticated: (result: DocumentSnapshot) => void, onNotAuthenticated: () => void) {
	onAuthStateChanged(getAuth(), (authUser: User | null) => {
		if (authUser !== null) {
			console.log("Bro is logged in:");

			const emailId: string = authUser.email as string;
			console.log(`Email: ${emailId}`);

			const docPromise: Promise<DocumentSnapshot> = getDoc(doc(firebaseDb, "users", emailId));
			docPromise.then((result: DocumentSnapshot) => {
				console.log(result.data()?.first_name);
				onAuthenticated(result);
			});
		} else {
			console.log("Bro is NOT logged in.");
			onNotAuthenticated();
		}
	});
}

// export async function authenticateUser(): Promise<DocumentSnapshot | null> {
// 	let result: DocumentSnapshot | null = null;

// 	onAuthStateChanged(getAuth(), async (authUser: User | null) => {
// 		if (authUser !== null) {
// 			console.log("Bro is logged in:");

// 			const emailId: string = authUser.email as string;
// 			console.log(`Email: ${emailId}`);

// 			result = await getDoc(doc(firebaseDb, "users", emailId));
// 		} else {
// 			console.log("Bro is NOT logged in.");
// 		}
// 	});

// 	return result;
// }
