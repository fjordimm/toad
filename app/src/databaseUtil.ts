import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc, type DocumentSnapshot } from "firebase/firestore";
import { firebaseDb } from "./toadFirebase";

export function authenticateUser(onAuthenticated: (result: DocumentSnapshot) => void, onNotAuthenticated: () => void) {
	onAuthStateChanged(getAuth(), (authUser: User | null) => {
		if (authUser !== null) {
			const emailId: string = authUser.email as string;

			const docPromise: Promise<DocumentSnapshot> = getDoc(doc(firebaseDb, "users", emailId));
			docPromise.then((result: DocumentSnapshot) => {
				onAuthenticated(result);
			});
		} else {
			onNotAuthenticated();
		}
	});
}

export async function retrieveTripDbDocs(userDbDoc: DocumentSnapshot): Promise<DocumentSnapshot[] | null> {
	// TODO: error handling
	// TODO: actually get the trips of the user

	return [
		await getDoc(doc(firebaseDb, "trips", "rT3hlFefjRkcnz7mjP05")),
		await getDoc(doc(firebaseDb, "trips", "tu3cHGwnOlWsodVEJkOs"))
	];
}
