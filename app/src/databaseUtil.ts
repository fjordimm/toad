import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, DocumentReference, getDoc, updateDoc, type DocumentSnapshot } from "firebase/firestore";
import { firebaseAuth, firebaseDb } from "./toadFirebase";

export class DbError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DbError";
	}
}

export class DbNoUserFoundError extends DbError {
	constructor(message: string) {
		super(message);
		this.name = "DbNoUserFoundError";
	}
}

export async function dbRetrieveUser(emailId: string): Promise<DocumentSnapshot> {
	const ret = await getDoc(doc(firebaseDb, "users", emailId));

	if (!ret.exists()) {
		throw new DbNoUserFoundError(`User with id '${emailId}' does not exist.`);
	}

	return ret;
}

export class DbNoTripFoundError extends DbError {
	constructor(message: string) {
		super(message);
		this.name = "DbNoTripFoundError";
	}
}

export async function dbRetrieveTrip(tripId: string): Promise<DocumentSnapshot> {
	const ret = await getDoc(doc(firebaseDb, "trips", tripId));

	if (!ret.exists()) {
		throw new DbNoTripFoundError(`Trip with id '${tripId}' does not exist.`);
	}

	return ret;
}

// Only run once (in TopLevelLayout)
export function dbCheckAndGetUserAuthentication(onAuthenticated: (result: DocumentReference) => void, onNotAuthenticated: () => void) {
	onAuthStateChanged(firebaseAuth, (authUser: User | null) => {
		if (authUser !== null) {
			console.log(`User is signed in: ${authUser.email}.`);
			// TODO: better null checking and error handling. The 'as' shouldn't be there
			onAuthenticated(doc(firebaseDb, "users", authUser.email as string));
		} else {
			console.log("User is not signed in.");
			onNotAuthenticated();
		}
	});
}

export async function dbRetrieveUsersListOfTrips(userDbDoc: DocumentSnapshot): Promise<DocumentSnapshot[]> {
	const ret: DocumentSnapshot[] = [];

	for (const item of userDbDoc.get("trips")) {
		ret.push(await dbRetrieveTrip(item));
	}

	return ret;
}

export async function dbRetrieveUsersListOfInvitations(userDbDoc: DocumentSnapshot): Promise<DocumentSnapshot[]> {
	const ret: DocumentSnapshot[] = [];

	for (const item of userDbDoc.get("trip_invites")) {
		ret.push(await dbRetrieveTrip(item));
	}

	return ret;
}

export async function dbCreateTrip(tripName: string, startDate: string, endDate: string, tripOwner: string): Promise<DocumentReference> {
	const itin = [];
	const num_days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
	for (let i = 0; i < num_days; i++) {
		const currentDay = new Date(new Date(startDate).getTime());
		currentDay.setDate(currentDay.getDate() + i);
		let temp_dict = {
			"day": currentDay,
			"activities": [],
			"stay_at": "",
			"additional_notes": ""
		};
		itin.push(temp_dict);
	}

	const tripDbDocRef: DocumentReference = await addDoc(collection(firebaseDb, "trips"), {
		trip_name: tripName,
		start_date: startDate,
		end_date: endDate,
		created_at: new Date(),
		trip_owner: tripOwner,
		days: num_days,
		trip_users: [],
		itinerary: itin,
		destinations: {}
	});

	await dbAddUserToTrip(tripDbDocRef, await dbRetrieveUser(tripOwner));

	return tripDbDocRef;
}

export async function dbDeleteTrip(tripDbDoc: DocumentSnapshot) {
	for (const emailId of tripDbDoc.get("trip_users"))
	{
		await updateDoc((await dbRetrieveUser(emailId)).ref, {
			trips: arrayRemove(tripDbDoc.id)
		});
	}

	// TODO: what if someone was invited to a trip, then the trip was deleted, then they accept the invitation
	
	await deleteDoc(tripDbDoc.ref);
}

export async function dbRetrieveTripsListOfMembers(tripDbDoc: DocumentSnapshot): Promise<DocumentSnapshot[]> {
	const ret: DocumentSnapshot[] = [];

	for (const item of tripDbDoc.get("trip_users")) {
		ret.push(await dbRetrieveUser(item));
	}

	return ret;
}

// TODO: be more consistent/deliberate with DocumentReference vs. DocumentSnapshot

export async function dbInviteUser(tripDbDocRef: DocumentReference, userEmailId: string) {
	const userDbDoc: DocumentSnapshot = await dbRetrieveUser(userEmailId);

	await updateDoc(userDbDoc.ref, {
		trip_invites: arrayUnion(tripDbDocRef.id)
	});
}

export async function dbAcceptInvitation(userDbDoc: DocumentSnapshot, tripId: string) {
	await updateDoc(userDbDoc.ref, {
		trip_invites: arrayRemove(tripId)
	});

	await dbAddUserToTrip((await dbRetrieveTrip(tripId)).ref, userDbDoc);
}

export async function dbDeclineInvitation(userDbDoc: DocumentSnapshot, tripId: string) {
	await updateDoc(userDbDoc.ref, {
		trip_invites: arrayRemove(tripId)
	});
}

export async function dbAddUserToTrip(tripDbDocRef: DocumentReference, userDbDoc: DocumentSnapshot) {
	await updateDoc(tripDbDocRef, {
		trip_users: arrayUnion(userDbDoc.id)
	});

	await updateDoc(userDbDoc.ref, {
		trips: arrayUnion(tripDbDocRef.id)
	});
}

export async function dbRemoveUserFromTrip(tripDbDoc: DocumentSnapshot, userDbDoc: DocumentSnapshot) {
	await updateDoc(userDbDoc.ref, {
		trips: arrayRemove(tripDbDoc.id)
	});

	await updateDoc(tripDbDoc.ref, {
		trip_users: arrayRemove(userDbDoc.id)
	});
}
