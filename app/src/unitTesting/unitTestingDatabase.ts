/*
 Description:
  A simple program for checking the validity of the values stored in the database.
 
 Interactions:
  - Meant to be used on the command line, separate from React-Router.
    The command `npm run test-database` should run this file.
*/

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
        logError("Field 'trip_invites' is not an array.");
    } else if (!(trip_invites instanceof Array)) {
        logError("Field 'trip_invites' is not an array.");
    } else {
        for (let i = 0; i < trip_invites.length; i++) {
            const invitee = trip_invites[i];
            if (invitee === undefined) {
                logError(`Element ${i} of 'trip_invites' is somehow undefined.`);
            } else if (typeof invitee !== "string") {
                logError(`Element ${i} of 'trip_invites' is not a string.`);
            }
        }
    }

    const trips = userDbDoc.get("trips");
    if (trips === undefined) {
        logError("Field 'trips' does not exist.");
    } else if (typeof trips !== "object") {
        logError("Field 'trips' is not an array.");
    } else if (!(trips instanceof Array)) {
        logError("Field 'trips' is not an array.");
    } else {
        for (const tripId of trips) {
            if (typeof tripId !== "string") {
                logError("An element of the field 'trips' is not a string.");
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
        console.log(`- Error (with trip doc '${tripDbDoc.id}'): ${msg}`);
    }

    if (!tripDbDoc.exists()) {
        logError("Document does not 'exist' but is somehow in the database.");
    }

    const created_at = tripDbDoc.get("created_at");
    if (created_at === undefined) {
        logError("Field 'created_at' does not exist.");
    } else if (typeof created_at !== "object") {
        logError("Field 'created_at' is not a Timestamp.");
    } else if (!(created_at instanceof Timestamp)) {
        logError("Field 'created_at' is not a Timestamp.");
    }

    const trip_name = tripDbDoc.get("trip_name");
    if (trip_name === undefined) {
        logError("Field 'trip_name' does not exist.");
    } else if (typeof trip_name !== "string") {
        logError("Field 'trip_name' is not a string.");
    }

    const trip_owner = tripDbDoc.get("trip_owner");
    if (trip_owner === undefined) {
        logError("Field 'trip_owner' does not exist.");
    } else if (typeof trip_owner !== "string") {
        logError("Field 'trip_owner' is not a string.");
    }

    const start_date = tripDbDoc.get("start_date");
    if (start_date === undefined) {
        logError("Field 'start_date' does not exist.");
    } else if (typeof start_date !== "string") {
        logError("Field 'start_date' is not a string.");
    } else if (isNaN(new Date(start_date).getTime())) {
        logError("Field 'start_date' is not in a valid format for a date.");
    }

    const end_date = tripDbDoc.get("end_date");
    if (end_date === undefined) {
        logError("Field 'end_date' does not exist.");
    } else if (typeof end_date !== "string") {
        logError("Field 'end_date' is not a string.");
    } else if (isNaN(new Date(end_date).getTime())) {
        logError("Field 'end_date' is not in a valid format for a date.");
    }

    const days = tripDbDoc.get("days");
    if (days === undefined) {
        logError("Field 'days' does not exist.");
    } else if (typeof days !== "number") {
        logError("Field 'days' is not a number.");
    }

    const trip_users = tripDbDoc.get("trip_users");
    if (trip_users === undefined) {
        logError("Field 'trip_users' does not exist.");
    } else if (typeof trip_users !== "object") {
        logError("Field 'trip_users' is not a object.");
    } else if (!(trip_users instanceof Array)) {
        logError("Field 'trip_users' is not an array.");
    } else {
        for (const userId of trip_users) {
            if (typeof userId !== "string") {
                logError("An element of field 'trip_users' is not a string.");
            }
        }
    }

    const destinations = tripDbDoc.get("destinations");
    if (destinations === undefined) {
        logError("Field 'destinations' does not exist.");
    } else if (typeof destinations !== "object") {
        logError("Field 'destinations' is not an object.");
    } else {
        for (const destinationId of Object.keys(destinations)) {
            if (typeof destinationId !== "string") {
                logError("A key in field 'destinations' is not a string.");
            } else {
                const destinationObj = destinations[destinationId];
                if (destinationObj === undefined) {
                    logError(`Item '${destinationId}' of field 'destinations' is somehow undefined.`);
                } else if (typeof destinationObj !== "object") {
                    logError(`Item '${destinationId}' of field 'destinations' is not an object.`);
                } else {
                    const description = destinationObj["description"];
                    if (description === undefined) {
                        logError(`Field 'description' of the item '${destinationId}' in field 'destinations' does not exist.`);
                    } else if (typeof description !== "string") {
                        logError(`Field 'description' of the item '${destinationId}' in field 'destinations' is not a string.`);
                    }

                    const is_in_itinerary = destinationObj["is_in_itinerary"];
                    if (is_in_itinerary === undefined) {
                        logError(`Field 'is_in_itinerary' of the item '${destinationId}' in field 'destinations' does not exist.`);
                    } else if (typeof is_in_itinerary !== "boolean") {
                        logError(`Field 'is_in_itinerary' of the item '${destinationId}' in field 'destinations' is not a boolean.`);
                    }

                    const length = destinationObj["length"];
                    if (length === undefined) {
                        logError(`Field 'length' of the item '${destinationId}' in field 'destinations' does not exist.`);
                    } else if (typeof length !== "string") {
                        logError(`Field 'length' of the item '${destinationId}' in field 'destinations' is not a string.`);
                    }

                    const name = destinationObj["name"];
                    if (name === undefined) {
                        logError(`Field 'name' of the item '${destinationId}' in field 'destinations' does not exist.`);
                    } else if (typeof name !== "string") {
                        logError(`Field 'name' of the item '${destinationId}' in field 'destinations' is not a string.`);
                    }

                    const price = destinationObj["price"];
                    if (price === undefined) {
                        logError(`Field 'price' of the item '${destinationId}' in field 'destinations' does not exist.`);
                    } else if (typeof price !== "string") {
                        logError(`Field 'price' of the item '${destinationId}' in field 'destinations' is not a string.`);
                    }

                    const time = destinationObj["time"];
                    if (time === undefined) {
                        logError(`Field 'time' of the item '${destinationId}' in field 'destinations' does not exist.`);
                    } else if (typeof time !== "string") {
                        logError(`Field 'time' of the item '${destinationId}' in field 'destinations' is not a string.`);
                    }
                }
            }

        }
    }

    const itinerary = tripDbDoc.get("itinerary");
    if (itinerary === undefined) {
        logError("Field 'itinerary' does not exist.");
    } else if (typeof itinerary !== "object") {
        logError("Field 'itinerary' is not an array.");
    } else if (!(itinerary instanceof Array)) {
        logError("Field 'itinerary' is not an array.");
    } else {
        for (let i = 0; i < itinerary.length; i++) {
            const itineraryDay = itinerary[i];
            if (itineraryDay === undefined) {
                logError(`Element ${i} of field 'itinerary' is somehow undefined.`);
            } else if (typeof itineraryDay !== "object") {
                logError(`Element ${i} of field 'itinerary' is not an object.`);
            } else {
                const day = itineraryDay["day"];
                if (day === undefined) {
                    logError(`Field 'day' of element '${i}' in field 'itinerary' does not exist.`);
                } else if (typeof day !== "object") {
                    logError(`Field 'day' of element '${i}' in field 'itinerary' is not a Timestamp.`);
                } else if (!(day instanceof Timestamp)) {
                    logError(`Field 'day' of element '${i}' in field 'itinerary' is not a Timestamp.`);
                }

                const stay_at = itineraryDay["stay_at"];
                if (stay_at === undefined) {
                    logError(`Field 'stay_at' of element '${i}' in field 'itinerary' does not exist.`);
                } else if (typeof stay_at !== "string") {
                    logError(`Field 'stay_at' of element '${i}' in field 'itinerary' is not a string.`);
                }

                const additional_notes = itineraryDay["additional_notes"];
                if (additional_notes === undefined) {
                    logError(`Field 'additional_notes' of element '${i}' in field 'itinerary' does not exist.`);
                } else if (typeof additional_notes !== "string") {
                    logError(`Field 'additional_notes' of element '${i}' in field 'itinerary' is not a string.`);
                }

                const activities = itineraryDay["activities"];
                if (activities === undefined) {
                    logError(`Field 'activities' of element '${i}' in field 'itinerary' does not exist.`);
                } else if (typeof activities !== "object") {
                    logError(`Field 'activities' of element '${i}' in field 'itinerary' is not an array.`);
                } else if (!(activities instanceof Array)) {
                    logError(`Field 'activities' of element '${i}' in field 'itinerary' is not an array.`);
                } else {
                    for (let j = 0; j < activities.length; j++) {
                        const activityId = activities[j];
                        if (activityId === undefined) {
                            logError(`Element ${j} of field 'activities' of element ${i} in field 'itinerary' is somehow undefined.`);
                        } else if (typeof activityId !== "string") {
                            logError(`Element ${j} of field 'activities' of element ${i} in field 'itinerary' is not a string.`);
                        }
                    }
                }
            }
        }
    }

    const expenses = tripDbDoc.get("expenses");
    if (expenses === undefined) {
        logError("Field 'expenses' does not exist.");
    } else if (typeof expenses !== "object") {
        logError("Field 'expenses' is not an object.");
    } else {
        for (const expenseId of Object.keys(expenses)) {
            if (typeof expenseId !== "string") {
                logError("A key in field 'expenses' is not a string.");
            } else {
                const expenseObj = expenses[expenseId];
                if (expenseObj === undefined) {
                    logError(`Item '${expenseId}' of field 'expenses' is somehow undefined.`);
                } else if (typeof expenseObj !== "object") {
                    logError(`Item '${expenseId}' of field 'expenses' is not an object.`);
                } else {
                    const name = expenseObj["name"];
                    if (name === undefined) {
                        logError(`Field 'name' of item '${expenseId}' in field 'expenses' does not exist.`);
                    } else if (typeof name !== "string") {
                        logError(`Field 'name' of item '${expenseId}' in field 'expenses' is not a string.`);
                    }

                    const date = expenseObj["date"];
                    if (date === undefined) {
                        logError(`Field 'date' of item '${expenseId}' in field 'expenses' does not exist.`);
                    } else if (typeof date !== "string") {
                        logError(`Field 'date' of item '${expenseId}' in field 'expenses' is not a string.`);
                    } else if (isNaN(new Date(date).getTime())) {
                        logError(`Field 'date' of item '${expenseId}' in field 'expenses' is not in a valid format for a date.`);
                    }

                    const time_added = expenseObj["time_added"];
                    if (time_added === undefined) {
                        logError(`Field 'time_added' of item '${expenseId}' in field 'expenses' does not exist.`);
                    } else if (typeof time_added !== "number") {
                        logError(`Field 'time_added' of item '${expenseId}' in field 'expenses' is not a number.`);
                    }

                    const expense_owner = expenseObj["expense_owner"];
                    if (expense_owner === undefined) {
                        logError(`Field 'expense_owner' of item '${expenseId}' in field 'expenses' does not exist.`);
                    } else if (typeof expense_owner !== "string") {
                        logError(`Field 'expense_owner' of item '${expenseId}' in field 'expenses' is not a string.`);
                    }

                    const total_amount = expenseObj["total_amount"];
                    if (total_amount === undefined) {
                        logError(`Field 'total_amount' of item '${expenseId}' in field 'expenses' does not exist.`);
                    } else if (typeof total_amount !== "string") {
                        logError(`Field 'total_amount' of item '${expenseId}' in field 'expenses' is not a string.`);
                    }

                    const even_split = expenseObj["even_split"];
                    if (even_split === undefined) {
                        logError(`Field 'even_split' of item '${expenseId}' in field 'expenses' does not exist.`);
                    } else if (typeof even_split !== "boolean") {
                        logError(`Field 'even_split' of item '${expenseId}' in field 'expenses' is not a boolean.`);
                    }

                    const payers = expenseObj["payers"];
                    if (payers === undefined) {
                        logError(`Field 'payers' of item '${expenseId}' in field 'expenses' does not exist.`);
                    } else if (typeof payers !== "object") {
                        logError(`Field 'payers' of item '${expenseId}' in field 'expenses' is not an object.`);
                    } else {
                        for (const payerId of Object.keys(payers)) {
                            if (typeof payerId !== "string") {
                                logError(`A key in field 'payers' of item '${expenseId}' in field 'expenses' is not a string.`);
                            } else {
                                const payerObj = payers[payerId];
                                if (payerObj === undefined) {
                                    logError(`Item '${payerId}' in field 'payers' of item '${expenseId}' in field 'expenses' is somehow undefined.`);
                                } else if (typeof payerObj !== "object") {
                                    logError(`Item '${payerId}' in field 'payers' of item '${expenseId}' in field 'expenses' is not an array.`);
                                } else if (!(payerObj instanceof Array)) {
                                    logError(`Item '${payerId}' in field 'payers' of item '${expenseId}' in field 'expenses' is not an array.`);
                                } else if (payerObj.length !== 2) {
                                    logError(`Item '${payerId}' in field 'payers' of item '${expenseId}' in field 'expenses' is does not have a length of 2.`);
                                } else {
                                    const item0 = payerObj[0];
                                    if (item0 === undefined) {
                                        logError(`Index 0 of item '${payerId}' in field 'payers' of item '${expenseId}' in field 'expenses' somehow does not exist.`);
                                    } else if (typeof item0 !== "number") {
                                        logError(`Index 0 of item '${payerId}' in field 'payers' of item '${expenseId}' in field 'expenses' is not a number.`);
                                    }

                                    const item1 = payerObj[1];
                                    if (item1 === undefined) {
                                        logError(`Index 1 of item '${payerId}' in field 'payers' of item '${expenseId}' in field 'expenses' somehow does not exist.`);
                                    } else if (typeof item1 !== "number") {
                                        logError(`Index 1 of item '${payerId}' in field 'payers' of item '${expenseId}' in field 'expenses' is not a number.`);
                                    } else if (item1 !== 0 && item1 !== 1) {
                                        logError(`Index 1 of item '${payerId}' in field 'payers' of item '${expenseId}' in field 'expenses' has a value other than 1 or 0.`);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    const polls = tripDbDoc.get("polls");
    if (polls === undefined) {
        logError("Field 'polls' does not exist.");
    } else if (typeof polls !== "object") {
        logError("Field 'polls' is not an object.");
    } else {
        for (const pollId of Object.keys(polls)) {
            if (typeof pollId !== "string") {
                logError("A key in field 'polls' is not a string.");
            } else {
                const pollObj = polls[pollId];
                if (pollObj === undefined) {
                    logError(`Item '${pollId}' of field 'polls' is somehow undefined.`);
                } else if (typeof pollObj !== "object") {
                    logError(`Item '${pollId}' of field 'polls' is not an object.`);
                } else {
                    const title = pollObj["title"];
                    if (title === undefined) {
                        logError(`Field 'title' of item '${pollId}' in field 'polls' does not exist.`);
                    } else if (typeof title !== "string") {
                        logError(`Field 'title' of item '${pollId}' in field 'polls' is not a string.`);
                    }

                    const description = pollObj["description"];
                    if (description === undefined) {
                        logError(`Field 'description' of item '${pollId}' in field 'polls' does not exist.`);
                    } else if (typeof description !== "string") {
                        logError(`Field 'description' of item '${pollId}' in field 'polls' is not a string.`);
                    }

                    const poll_owner = pollObj["poll_owner"];
                    if (poll_owner === undefined) {
                        logError(`Field 'poll_owner' of item '${pollId}' in field 'polls' does not exist.`);
                    } else if (typeof poll_owner !== "string") {
                        logError(`Field 'poll_owner' of item '${pollId}' in field 'polls' is not a string.`);
                    }

                    const time_added = pollObj["time_added"];
                    if (time_added === undefined) {
                        logError(`Field 'time_added' of item '${pollId}' in field 'polls' does not exist.`);
                    } else if (typeof time_added !== "number") {
                        logError(`Field 'time_added' of item '${pollId}' in field 'polls' is not a number.`);
                    }

                    const options = pollObj["options"];
                    if (options === undefined) {
                        logError(`Field 'options' of item '${pollId}' in field 'polls' does not exist.`);
                    } else if (typeof options !== "object") {
                        logError(`Field 'options' of item '${pollId}' in field 'polls' is not an array.`);
                    } else if (!(options instanceof Array)) {
                        logError(`Field 'options' of item '${pollId}' in field 'polls' is not an array.`);
                    } else {
                        for (let i = 0; i < options.length; i++) {
                            const optionObj = options[i];
                            if (optionObj === undefined) {
                                logError(`Element ${i} of field 'options' of item '${pollId}' in field 'polls' is somehow undefined.`);
                            } else if (typeof optionObj !== "string") {
                                logError(`Element ${i} of field 'options' of item '${pollId}' in field 'polls' is not a string.`);
                            }
                        }
                    }

                    const votes = pollObj["votes"];
                    if (votes === undefined) {
                        logError(`Field 'votes' of item '${pollId}' in field 'polls' does not exist.`);
                    } else if (typeof votes !== "object") {
                        logError(`Field 'votes' of item '${pollId}' in field 'polls' is not an object.`);
                    } else {
                        for (const voteKey of Object.keys(votes)) {
                            if (typeof voteKey !== "string") {
                                logError(`A key in field 'votes' of item '${pollId}' in field 'polls' is not a string.`);
                            } else {
                                const voteObj = votes[voteKey];
                                if (voteObj === undefined) {
                                    logError(`Item '${voteKey}' in field 'votes' of item '${pollId}' in field 'polls' is somehow undefined.`);
                                } else if (typeof voteObj !== "object") {
                                    logError(`Item '${voteKey}' in field 'votes' of item '${pollId}' in field 'polls' is not an array.`);
                                } else if (!(voteObj instanceof Array)) {
                                    logError(`Item '${voteKey}' in field 'votes' of item '${pollId}' in field 'polls' is not an array.`);
                                } else {
                                    for (let i = 0; i < voteObj.length; i++) {
                                        const userId = voteObj[i];
                                        if (userId === undefined) {
                                            logError(`Element ${i} of item '${voteKey}' in field 'votes' of item '${pollId}' in field 'polls' is somehow undefined.`);
                                        } else if (typeof userId !== "string") {
                                            logError(`Element ${i} of item '${voteKey}' in field 'votes' of item '${pollId}' in field 'polls' is not a string.`);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

main();
