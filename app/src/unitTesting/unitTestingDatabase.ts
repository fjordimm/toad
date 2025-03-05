import { collection, doc, DocumentSnapshot, getDoc, getDocs, QuerySnapshot, Timestamp } from "firebase/firestore";
import { firebaseDb } from "../toadFirebase";

async function main() {
    console.log("===== Starting Test =====");
    console.log();

    try {
        await testAllUsers();
        console.log();
        await testAllTrips();
    } catch (e) {
        console.log("An error occurred while testing:");
        console.log(e);
    }

    console.log();
    console.log("===== Finished Test =====");
    process.exit();
}

async function testAllUsers() {
    console.log("Testing Users:");

    const usersDbQry: QuerySnapshot = await getDocs(collection(firebaseDb, "users"));

    const listOfUserDbDocs: DocumentSnapshot[] = [];
    usersDbQry.forEach((userDbDoc: DocumentSnapshot) => {
        listOfUserDbDocs.push(userDbDoc);
    });

    for (const userDbDoc of listOfUserDbDocs) {
        testUser(userDbDoc);
    }
}

function testUser(userDbDoc: DocumentSnapshot) {
    function logError(msg: string) {
        console.log(`- Error (with user doc '${userDbDoc.id}'): ${msg}`);
    }

    if (!userDbDoc.exists()) {
        logError("Document does not 'exist' but is somehow in the database.");
    }

    const email = userDbDoc.get("email");
    if (email === undefined) {
        logError("Field 'email' does not exist.");
    } else if (typeof email !== "string") {
        logError("Field 'email' is not a string.");
    }

    const first_name = userDbDoc.get("first_name");
    if (first_name === undefined) {
        logError("Field 'first_name' does not exist.");
    } else if (typeof first_name !== "string") {
        logError("Field 'first_name' is not a string.");
    }

    const last_name = userDbDoc.get("last_name");
    if (last_name === undefined) {
        logError("Field 'last_name' does not exist.");
    } else if (typeof last_name !== "string") {
        logError("Field 'last_name' is not a string.");
    }

    const trip_invites = userDbDoc.get("trip_invites");
    if (trip_invites === undefined) {
        logError("Field 'trip_invites' does not exist.");
    } else if (typeof trip_invites !== "object") {
        logError("Field 'trip_invites' is not an object.");
    } else if (!(trip_invites instanceof Array)) {
        logError("Field 'trip_invites' is not an array.");
    } else {
        for (const tripId of trip_invites) {
            if (typeof tripId !== "string") {
                logError("An element of field 'trip_invites' is not a string.");
            }
        }
    }

    const trips = userDbDoc.get("trips");
    if (trips === undefined) {
        logError("Field 'trips' does not exist.");
    } else if (typeof trips !== "object") {
        logError("Field 'trips' is not an object.");
    } else if (!(trips instanceof Array)) {
        logError("Field 'trips' is not an array.");
    } else {
        for (const tripId of trips) {
            if (typeof tripId !== "string") {
                logError("An element of field 'trips' is not a string.");
            }
        }
    }
}

async function testAllTrips() {
    console.log("Testing Trips:");

    const tripsDbQry: QuerySnapshot = await getDocs(collection(firebaseDb, "trips"));

    const listOfTripDbDocs: DocumentSnapshot[] = [];
    tripsDbQry.forEach((tripDbDoc: DocumentSnapshot) => {
        listOfTripDbDocs.push(tripDbDoc);
    });

    for (const tripDbDoc of listOfTripDbDocs) {
        testTrip(tripDbDoc);
    }
}

function testTrip(tripDbDoc: DocumentSnapshot) {
    function logError(msg: string) {
        console.log(`- Error (with user doc '${tripDbDoc.id}'): ${msg}`);
    }

    if (!tripDbDoc.exists()) {
        logError("Document does not 'exist' but is somehow in the database.");
    }

    const created_at = tripDbDoc.get("created_at");
    if (created_at === undefined) {
        logError("Field 'created_at' does not exist.");
    } else if (typeof created_at !== "object") {
        logError("Field 'created_at' is not an object.");
    } else if (!(created_at instanceof Timestamp)) {
        logError("Field 'created_at' is not a Timestamp.");
    }

    const trip_name = tripDbDoc.get("trip_name");
    if (trip_name === undefined)  {
        logError("Field 'trip_name' does not exist.");
    } else if (typeof trip_name !== "string") {
        logError("Field 'trip_name' is not a string.");
    }

    const trip_owner = tripDbDoc.get("trip_owner");
    if (trip_owner === undefined)  {
        logError("Field 'trip_owner' does not exist.");
    } else if (typeof trip_owner !== "string") {
        logError("Field 'trip_owner' is not a string.");
    }

    const start_date = tripDbDoc.get("start_date");
    if (start_date === undefined)  {
        logError("Field 'start_date' does not exist.");
    } else if (typeof start_date !== "string") {
        logError("Field 'start_date' is not a string.");
    } else if (isNaN(new Date(start_date).getTime())) {
        logError("Field 'start_date' is not in a valid format for a date.");
    }

    const end_date = tripDbDoc.get("end_date");
    if (end_date === undefined)  {
        logError("Field 'end_date' does not exist.");
    } else if (typeof end_date !== "string") {
        logError("Field 'end_date' is not a string.");
    } else if (isNaN(new Date(end_date).getTime())) {
        logError("Field 'end_date' is not in a valid format for a date.");
    }

    const days = tripDbDoc.get("days");
    if (days === undefined)  {
        logError("Field 'days' does not exist.");
    } else if (typeof days !== "number") {
        logError("Field 'days' is not a number.");
    }

    // trip_users

    // destinations

    // itinerary

    // expenses

    // polls



    // const _____ = tripDbDoc.get("_____");
    // if (_____ === undefined)  {
    //     logError("Field '_____' does not exist.");
    // } else if (typeof _____ !== "number") {
    //     logError("Field '_____' is not a number.");
    // }
}

main();
