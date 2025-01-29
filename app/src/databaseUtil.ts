import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { arrayRemove, arrayUnion, deleteDoc, doc, DocumentReference, getDoc, updateDoc, type DocumentSnapshot } from "firebase/firestore";
import { firebaseDb } from "./toadFirebase";

export function checkAndGetUserAuthentication(onAuthenticated: (result: DocumentReference) => void, onNotAuthenticated: () => void) {
	onAuthStateChanged(getAuth(), (authUser: User | null) => {
		if (authUser !== null) {
			// TODO: better null checking and error handling. The 'as' shouldn't be there
			onAuthenticated(doc(firebaseDb, "users", authUser.email as string));
		} else {
			onNotAuthenticated();
		}
	});
}

export async function retrieveTripDbDocList(userDbDoc: DocumentSnapshot): Promise<DocumentSnapshot[] | null> {
	// TODO: better error handling and null handling

	const ret: DocumentSnapshot[] = [];

	for (const item of userDbDoc.data()?.trips) {
		ret.push(await getDoc(doc(firebaseDb, "trips", item)));
	}

	console.log(`Bruh length = ${ret.length}`);

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

export async function retrieveTripMemberDbDocList(tripDbDoc: DocumentSnapshot): Promise<DocumentSnapshot[] | null> {
	// TODO: better error handling and null handling

	const ret: DocumentSnapshot[] = [];

	for (const item of tripDbDoc.data()?.trip_users) {
		ret.push(await getDoc(doc(firebaseDb, "users", item)));
	}

	return ret;
}

export async function addUserToTrip(tripDbDoc: DocumentSnapshot, userDbDoc: DocumentSnapshot) {
	await updateDoc(tripDbDoc.ref, {
		trip_users: arrayUnion(userDbDoc.data()?.email)
	});

	await updateDoc(userDbDoc.ref, {
		trips: arrayUnion(tripDbDoc.id)
	});
}
