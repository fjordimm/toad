import React, { useEffect, useState } from "react";
import { Form, useNavigate } from "react-router";
import ToadMember from "./ToadCount/ToadMember";
import { doc, getDoc, type DocumentSnapshot } from "firebase/firestore";
import { dbAddUserToTrip, dbDeleteTrip, dbRetrieveTripsListOfMembers, dbRetrieveUser } from "~/src/databaseUtil";
import { firebaseDb } from "~/src/toadFirebase";
import Loading from "./Loading";

function turnListOfTripsMembersIntoElems(listOfTripsMembers: DocumentSnapshot[] | null) {
	if (listOfTripsMembers !== null) {
		return listOfTripsMembers.map((trip: DocumentSnapshot) => {
			return <ToadMember name={trip.get("first_name")} />
		});
	} else {
		return <Loading />;
	}
}

export default function ToadCount(props: { tripDbDoc: DocumentSnapshot | null }) {

	console.log("TOAD COUNT RERENDERING");

	const navigate = useNavigate();

	const [listOfTripsMembers, setListOfTripMembers] = useState<DocumentSnapshot[] | null>(null);
	useEffect(
		() => {
			if (props.tripDbDoc !== null) {
				dbRetrieveTripsListOfMembers(props.tripDbDoc).then(
					(result: DocumentSnapshot[] | null) => {
						setListOfTripMembers(result);
					}
				);
			}
		},
		[ props.tripDbDoc ]
	);

	const [email, setEmail] = useState("");

	async function handleInviteSubmit(e: React.FormEvent<HTMLFormElement>) {
		// const user = await getDoc(doc(firebaseDb, "users", email));
		// await dbAddUserToTrip(props.tripDbDoc as DocumentSnapshot, user);

		console.log("yeeeeeeeeee");
		if (props.tripDbDoc !== null) {
			console.log("yaaaaaaaaa");
			await dbAddUserToTrip(props.tripDbDoc.ref, await dbRetrieveUser(email));
		}

		setEmail("");
	}

	async function handleDeleteTrip(tripDbDoc: DocumentSnapshot | null) {
		if (tripDbDoc !== null) {
			await dbDeleteTrip(tripDbDoc);
			navigate("/");
		} else {
			console.log("Trying to delete an invalid trip.");
		}
	}

	return (
		<div className="relative">
			{/* Positioning the container closer to the top-left */}
			<div
			className="absolute top-2 right-2 max-w-[271px] w-full max-h-[330px] bg-[#EAFFB9] p-6 rounded-lg shadow-lg"
			>
			{/* Toad Count */}
			<div className="flex flex-col items-center text-[24px] font-sunflower text-[#3C533A]">
				Toad Count: #
			</div>

			{/* Member List */}
			<div className="mt-4 max-h-40 overflow-y-auto scrollbar-none space-y-3">
				{ turnListOfTripsMembersIntoElems(listOfTripsMembers) }
			</div>

			{/* Email Input and Invite Button */}
			<div className="mt-2 flex flex-col items-center space-y-3">
				<Form onSubmit={handleInviteSubmit}>
					<input
						type="email"
						placeholder="Enter member email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full max-w-[207px] h-[22px] bg-white border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-lime-400 text-center"
					/>
					<button
						className="w-full max-w-[207px] h-[29px] bg-[#BCD3B5]/50 text-[#3C533A] rounded-lg text-sm hover:bg-[#BCD3B5]/70 text-center"
					>
						+ Invite Member
					</button>
				</Form>
			</div>
			{/* Delete Trip Button */}
			<div className="mt-10 flex flex-col items-center">
				<button
					onClick={ () => handleDeleteTrip(props.tripDbDoc) }
					className="w-[271px] h-[46px] bg-[#D86D6D]/50 text-white rounded-lg text-sm hover:bg-[#D86D6D]/70 text-center"
				>
					Delete Trip
				</button>
				</div>
			</div>
		</div>
	);
}
