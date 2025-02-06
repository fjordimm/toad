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

export async function dbCreateTrip(tripName: string, startDate: string, endDate: string, tripOwner: string): Promise<DocumentReference> {
	//let itin:Array<Map<string, any>> = [];
	let itin = [];

	let num_days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
	for(let i = 0; i <= num_days; i++) {
		// let temp_dict = new Map<string, any>();
		const currentDay = new Date(startDate + "T00:00:00");
		currentDay.setDate(currentDay.getDate() + i);
		// temp_dict.set("day", currentDay);
		// temp_dict.set("activities", []);
		// temp_dict.set("stay_at", "");
		// temp_dict.set("additional_notes", "");
		let temp_dict = {"day": currentDay,
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

	await dbAddUserToTrip(tripDbDocRef, tripOwner);

	return tripDbDocRef;
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

export async function dbRetrieveTrip(tripId: string): Promise<DocumentSnapshot | null> {
	return await getDoc(doc(firebaseDb, "trips", tripId));
}

export async function dbRetrieveTripsListOfMembers(tripDbDoc: DocumentSnapshot): Promise<DocumentSnapshot[] | null> {
	// TODO: better error handling and null handling

	const ret: DocumentSnapshot[] = [];

	for (const item of tripDbDoc.get("trip_users")) {
		ret.push(await getDoc(doc(firebaseDb, "users", item)));
	}

	return ret;
}

export async function dbRetrieveTripItinerary(tripDbDoc: DocumentSnapshot): Promise<Record<string, any>| null>{
	try{

		// checks if the trip exists
		if (tripDbDoc.exists()){
			const data = tripDbDoc.data();

			// if itinerary does not exist, return [] as itineraryList
			const itineraryList = data?.itinerary || [];
			return itineraryList

		}else{
			console.log("Trip Document Does Not Exist");
			return [];
		}
	} catch(error){
		console.error("Error fetching document:", error);
        return [];
	}
}

// TODO: be more consistent/deliberate with DocumentReference vs. DocumentSnapshot

export async function dbAddUserToTrip(tripDbDocRef: DocumentReference, userEmailId: string) {
	const userDbDoc: DocumentSnapshot = await getDoc(doc(firebaseDb, "users", userEmailId));
	
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
