import { onAuthStateChanged, type User } from "firebase/auth";
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, DocumentReference, getDoc, updateDoc, type DocumentSnapshot } from "firebase/firestore";
import { firebaseAuth, firebaseDb } from "./toadFirebase";
import { generateUuid } from "./miscUtil";

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

export async function dbRetrieveAllTripUsers(tripDbDoc: DocumentSnapshot): Promise<DocumentSnapshot[]> {
    const ret: DocumentSnapshot[] = [];
    
    const tripUsers: string[] = tripDbDoc.get("trip_users");
    for (let emailId of tripUsers) {
        ret.push(await dbRetrieveUser(emailId));
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
            // TODO: better null checking and error handling. The 'as' shouldn't be there
            onAuthenticated(doc(firebaseDb, "users", authUser.email as string));
        } else {
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
    //let itin:Array<Map<string, any>> = [];
    const itin = [];

    const num_days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    for (let i = 0; i <= num_days; i++) {
        // let temp_dict = new Map<string, any>();
        const currentDay = new Date(startDate + "T00:00:00");
        currentDay.setDate(currentDay.getDate() + i);
        const temp_dict = {
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
        destinations: {},
        expenses: {}
    });

    await dbAddUserToTrip(tripDbDocRef, await dbRetrieveUser(tripOwner));

    return tripDbDocRef;
}

export async function dbDeleteTrip(tripDbDoc: DocumentSnapshot) {
    for (const emailId of tripDbDoc.get("trip_users")) {
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

export async function dbRetrieveTripItinerary(tripDbDoc: DocumentSnapshot): Promise<Record<string, any> | null> {
    try {

        // checks if the trip exists
        if (tripDbDoc.exists()) {
            const data = tripDbDoc.data();

            // if itinerary does not exist, return [] as itineraryList
            const itineraryList = data?.itinerary || [];
            return itineraryList;

        } else {
            console.log("Trip Document Does Not Exist");
            return [];
        }
    } catch (error) {
        console.error("Error fetching document:", error);
        return [];
    }
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

export async function dbAddDestination(tripDbDocRef: DocumentReference, isInItinerary: boolean, name: string, price: string, length: string, time: string, description: string) {
    const tripDbDoc: DocumentSnapshot = await getDoc(tripDbDocRef);

    const destinationId: string = generateUuid();

    const destinationsObj = tripDbDoc.get("destinations");
    destinationsObj[destinationId] = {
        is_in_itinerary: isInItinerary,
        name: name,
        price: price,
        length: length,
        time: time,
        description: description
    };
    await updateDoc(tripDbDoc.ref, {
        destinations: destinationsObj
    });
}

// Use -1 for dayIndex to move it to Possible Stops
export async function dbMoveDestination(tripDbDocRef: DocumentReference, dayIndex: number, destinationId: string) {
    const tripDbDoc: DocumentSnapshot = await getDoc(tripDbDocRef);

    if (dayIndex === -1) { // If caller wants to move it to Possible Stops
        await dbRemoveDestinationFromAllItineraryDays(tripDbDocRef, destinationId);
    } else {
        const itineraryObj = tripDbDoc.get("itinerary");
        if (itineraryObj[dayIndex]["activities"].includes(destinationId)) { // If it already is in that day
            // Do nothing
        } else {
            await dbRemoveDestinationFromAllItineraryDays(tripDbDocRef, destinationId);
            await dbAddDestinationToItineraryDay(tripDbDocRef, dayIndex, destinationId);
        }
    }
}

export async function dbSortDestinationWithinDay(tripDbDocRef: DocumentReference, draggedDestinationId: string, overDestinationId: string) {
    const tripDbDoc: DocumentSnapshot = await getDoc(tripDbDocRef);

    const itineraryObj = tripDbDoc.get("itinerary");

    let dayIndex: number = -1;
    let indexOfOverDestination: number = -1;
    for (let i = 0; i < itineraryObj.length; i++) {
        const possibleIndex = itineraryObj[i]["activities"].indexOf(overDestinationId);
        if (possibleIndex !== -1) {
            dayIndex = i;
            indexOfOverDestination = possibleIndex;
            break;
        }
    }

    if (dayIndex !== -1 && indexOfOverDestination !== -1) {
        if (itineraryObj[dayIndex]["activities"].includes(draggedDestinationId)) { // Only actually does it if it was already in the same day. This fixes a bug.
            itineraryObj[dayIndex]["activities"] = itineraryObj[dayIndex]["activities"].filter((item: string) => item !== draggedDestinationId);
            itineraryObj[dayIndex]["activities"].splice(indexOfOverDestination, 0, draggedDestinationId);
            await updateDoc(tripDbDoc.ref, {
                itinerary: itineraryObj
            });
        }
    }
}

export async function dbAddDestinationToItineraryDay(tripDbDocRef: DocumentReference, dayIndex: number, destinationId: string) {
    const tripDbDoc: DocumentSnapshot = await getDoc(tripDbDocRef);

    const itineraryObj = tripDbDoc.get("itinerary");
    itineraryObj[dayIndex]["activities"].push(destinationId);
    await updateDoc(tripDbDoc.ref, {
        itinerary: itineraryObj
    });

    const destinationsObj = tripDbDoc.get("destinations");
    destinationsObj[destinationId].is_in_itinerary = true;
    await updateDoc(tripDbDoc.ref, {
        destinations: destinationsObj
    });
}

export async function dbRemoveDestinationFromAllItineraryDays(tripDbDocRef: DocumentReference, destinationId: string) {
    const tripDbDoc: DocumentSnapshot = await getDoc(tripDbDocRef);

    const itineraryObj = tripDbDoc.get("itinerary");
    for (let i = 0; i < itineraryObj.length; i++) {
        itineraryObj[i]["activities"] = itineraryObj[i]["activities"].filter((item: string) => item !== destinationId);
    }
    await updateDoc(tripDbDoc.ref, {
        itinerary: itineraryObj
    });

    const destinationsObj = tripDbDoc.get("destinations");
    destinationsObj[destinationId].is_in_itinerary = false;
    await updateDoc(tripDbDoc.ref, {
        destinations: destinationsObj
    });
}

export async function dbDeleteDestination(tripDbDocRef: DocumentReference, destinationId: string) {
    const tripDbDoc: DocumentSnapshot = await getDoc(tripDbDocRef);

    const destinationsObj = tripDbDoc.get("destinations");
    delete destinationsObj[destinationId];
    await updateDoc(tripDbDoc.ref, {
        destinations: destinationsObj
    });
}

export async function dbAddExpense(tripDbDocRef: DocumentReference, name: string, totalAmount: string, date: string, expenseOwner: string, evenSplit: boolean, payers: { [key: string]: number[] }) {
    const tripDbDoc: DocumentSnapshot = await getDoc(tripDbDocRef);

    const expenseId: string = generateUuid();

    const expensesObj = tripDbDoc.get("expenses");
    expensesObj[expenseId] = {
        name: name,
        total_amount: totalAmount,
        date: date,
        time_added: new Date().getTime(),
        expense_owner: expenseOwner,
        even_split: evenSplit,
        payers: payers
    };
    await updateDoc(tripDbDoc.ref, {
        expenses: expensesObj
    });
}

export async function dbDeleteExpense(tripDbDocRef: DocumentReference, expenseId: string) {
    const tripDbDoc: DocumentSnapshot = await getDoc(tripDbDocRef);

    const expensesObj = tripDbDoc.get("expenses");
    delete expensesObj[expenseId];
    await updateDoc(tripDbDoc.ref, {
        expenses: expensesObj
    });
}

export async function dbMarkExpenseAsPaidOrUnpaid(tripDbDocRef: DocumentReference, expenseId: string, payerId: string, value: boolean) {
    const tripDbDoc: DocumentSnapshot = await getDoc(tripDbDocRef);

    const expensesObj = tripDbDoc.get("expenses");
    expensesObj[expenseId].payers[payerId][1] = value ? 1 : 0;
    await updateDoc(tripDbDoc.ref, {
        expenses: expensesObj
    });
}
