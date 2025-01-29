import React, { useEffect, useState } from "react";
import { Form, useNavigate } from "react-router";
import ToadMember from "./ToadCount/ToadMember";
import { doc, getDoc, type DocumentSnapshot } from "firebase/firestore";
import { addUserToTrip, deleteTripDbDoc, retrieveTripMemberDbDocList } from "~/src/databaseUtil";
import { firebaseDb } from "~/src/toadFirebase";
import Loading from "./Loading";

function turnTripMemberDbDocListIntoElems(tripMemberDbDocList: DocumentSnapshot[] | null) {
	if (tripMemberDbDocList !== null) {
		return tripMemberDbDocList.map((trip: DocumentSnapshot) => {
			return <p>{trip.data()?.first_name}</p>;
		});
	} else {
		return <Loading />;
	}
}

export default function ToadCount(props: { tripDbDoc: DocumentSnapshot | null }) {

	const navigate = useNavigate();

	const [tripMemberDbDocList, setTripMemberDbDocList] = useState<DocumentSnapshot[] | null>(null);
	useEffect(
		() => {
			if (props.tripDbDoc !== null) {
				retrieveTripMemberDbDocList(props.tripDbDoc).then(
					(result: DocumentSnapshot[] | null) => {
						setTripMemberDbDocList(result);
					}
				);
			} else {
				console.log("Bad doc.");
			}
		},
		[ props.tripDbDoc ] // TODO: made it actually update on real state changes
	);

	const [email, setEmail] = useState("");

	async function handleInviteSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const user = await getDoc(doc(firebaseDb, "users", email));
		await addUserToTrip(props.tripDbDoc as DocumentSnapshot, user);
	}

	async function handleDeleteTripButton(tripDbDoc: DocumentSnapshot | null) {
		if (tripDbDoc != null) {
			console.log(`Trip id = ${tripDbDoc.id}`);
			await deleteTripDbDoc(tripDbDoc);
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
				{/* Can add members to the trip by calling <ToadMembers name="name" /> */}
				{/* <ToadMember name="Angelina" />
				<ToadMember name="Billiam" />
				<ToadMember name="Sophie" />
				<ToadMember name="Arnav" />
				<ToadMember name="Jiggy" />
				<ToadMember name="Angelina" /> */}
				{ turnTripMemberDbDocListIntoElems(tripMemberDbDocList) }
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
					onClick={ () => handleDeleteTripButton(props.tripDbDoc) }
					className="w-[271px] h-[46px] bg-[#D86D6D]/50 text-white rounded-lg text-sm hover:bg-[#D86D6D]/70 text-center"
				>
					Delete Trip
				</button>
				</div>
			</div>
		</div>
	);
}
