import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, updateDoc, type DocumentSnapshot } from "firebase/firestore";
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

export async function retrieveTripDbDocList(userDbDoc: DocumentSnapshot): Promise<DocumentSnapshot[] | null> {
	// TODO: better error handling and null handling

	const ret: DocumentSnapshot[] = []

	for (const item of userDbDoc.data()?.trips) {
		ret.push(await getDoc(doc(firebaseDb, "trips", item)));
	}

	return ret;
}

export async function retrieveTripDbDoc(tripId: string): Promise<DocumentSnapshot | null> {
	return await getDoc(doc(firebaseDb, "trips", tripId));
}

export async function deleteTripDbDoc(tripDbDoc: DocumentSnapshot) {

	console.log(`Deleting trip with id = ${tripDbDoc.id}`);

	for (const emailId of tripDbDoc.data()?.trip_users)
	{
		await updateDoc(doc(firebaseDb, "users", emailId), {
			trips: arrayRemove(tripDbDoc.id)
		});
	}
	
	await deleteDoc(tripDbDoc.ref);
}

export async function addUserToTrip(tripDbDoc: DocumentSnapshot, userDbDoc: DocumentSnapshot) {
	await updateDoc(tripDbDoc.ref, {
		trip_users: arrayUnion(userDbDoc.data()?.email)
	});

	await updateDoc(userDbDoc.ref, {
		trips: arrayUnion(tripDbDoc.id)
	});
}
