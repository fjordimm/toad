import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, DocumentReference, getDoc, updateDoc, type DocumentSnapshot } from "firebase/firestore";
import { firebaseDb } from "./toadFirebase";

export async function dbRetrieveUser(emailId: string): Promise<DocumentSnapshot> {
	return await getDoc(doc(firebaseDb, "users", emailId));
}

// Only run once (in TopLevelLayout)
export function dbCheckAndGetUserAuthentication(onAuthenticated: (result: DocumentReference) => void, onNotAuthenticated: () => void) {
	onAuthStateChanged(getAuth(), (authUser: User | null) => {
		if (authUser !== null) {
			// TODO: better null checking and error handling. The 'as' shouldn't be there
			onAuthenticated(doc(firebaseDb, "users", authUser.email as string));
		} else {
			onNotAuthenticated();
		}
	});
}

export async function dbRetrieveUsersListOfTrips(userDbDoc: DocumentSnapshot): Promise<DocumentSnapshot[] | null> {
	const ret: DocumentSnapshot[] = [];

	for (const item of userDbDoc.get("trips")) {
		ret.push(await getDoc(doc(firebaseDb, "trips", item)));
	}

	return ret;
}

export async function dbRetrieveTrip(tripId: string): Promise<DocumentSnapshot | null> {
	return await getDoc(doc(firebaseDb, "trips", tripId));
}

export async function dbRetrieveTripsListOfMembers(tripDbDoc: DocumentSnapshot): Promise<DocumentSnapshot[] | null> {
	// TODO: better error handling and null handling

	const ret: DocumentSnapshot[] = [];

	for (const item of tripDbDoc.data()?.trip_users) {
		ret.push(await getDoc(doc(firebaseDb, "users", item)));
	}

	return ret;
}

export async function dbDeleteTrip(tripDbDoc: DocumentSnapshot) {
	for (const emailId of tripDbDoc.get("trip_users"))
	{
		await updateDoc(doc(firebaseDb, "users", emailId), {
			trips: arrayRemove(tripDbDoc.id)
		});
	}
	
	await deleteDoc(tripDbDoc.ref);
}

export async function dbCreateTrip(tripName: string, startDate: string, endDate: string, tripOwner: string): Promise<DocumentReference> {
	const tripDbDocRef: DocumentReference = await addDoc(collection(firebaseDb, "trips"), {
		trip_name: tripName,
		start_date: startDate,
		end_date: endDate,
		created_at: new Date(),
		trip_owner: tripOwner,
		days: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)),
		trip_users: []
	});

	await dbAddUserToTrip(tripDbDocRef, await dbRetrieveUser(tripOwner));

	return tripDbDocRef;
}

export async function dbAddUserToTrip(tripDbDocRef: DocumentReference, userDbDoc: DocumentSnapshot) {
	await updateDoc(tripDbDocRef, {
		trip_users: arrayUnion(userDbDoc.id)
	});

	await updateDoc(userDbDoc.ref, {
		trips: arrayUnion(tripDbDocRef.id)
	});
}
