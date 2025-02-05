import toadLogo from "/toadLogo.png";
import TripButton from './MenuBar/TripsButton'
import InvitationButton from './MenuBar/InvitationButton';
import { useEffect, useState, type ReactNode } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, DocumentReference, DocumentSnapshot, getDoc, onSnapshot } from 'firebase/firestore';
import { firebaseAuth, firebaseDb } from '~/src/toadFirebase';
import type { Route } from '../pages/+types/MainLayout';
import { Link, Navigate, redirect, useNavigate } from 'react-router';
import TripsButton from './MenuBar/TripsButton';
import Loading from './Loading';
import { dbRetrieveUsersListOfInvitations, dbRetrieveUsersListOfTrips } from '~/src/databaseUtil';
import { debugLogComponentRerender } from "~/src/debugUtil";

export default function MenuBar(props: { userDbDoc: DocumentSnapshot }) {

	debugLogComponentRerender("MenuBar");

	function turnUserListOfTripsIntoElems(userListOfTrips: DocumentSnapshot[] | null): ReactNode {
		if (userListOfTrips !== null) {
			return userListOfTrips.map((trip: DocumentSnapshot) => {
				return <TripsButton tripDbDoc={trip} num={0} />
			});
		} else {
			return <Loading />;
		}
	}

	function turnUserListOfInvitationsIntoElems(userListOfInvitations: DocumentSnapshot[] | null): ReactNode {
		if (userListOfInvitations !== null) {
			return userListOfInvitations.map((trip: DocumentSnapshot) => {
				// return <TripsButton tripDbDoc={trip} num={0} />
				// return <p>Yippity skippity {trip.id}</p>
				return <InvitationButton userDbDoc={props.userDbDoc} tripDbDoc={trip} />;
			});
		} else {
			return <Loading />;
		}
	}

	const navigate = useNavigate();

	const [open, setOpen] = useState(true);

	const [userListOfTrips, setUserListOfTrips] = useState<DocumentSnapshot[] | null>(null);
	useEffect(
		() => {
			dbRetrieveUsersListOfTrips(props.userDbDoc).then(
				(result: DocumentSnapshot[] | null) => {
					setUserListOfTrips(result);
				}
			);
		},
		[ props.userDbDoc ]
	);

	const [userListOfInvitations, setUserListOfInvitations] = useState<DocumentSnapshot[] | null>(null);
	useEffect(
		() => {
			dbRetrieveUsersListOfInvitations(props.userDbDoc).then(
				(result: DocumentSnapshot[] | null) => {
					setUserListOfInvitations(result);
				}
			);
		},
		[ props.userDbDoc ]
	);

	async function handleLogOut() {
		await firebaseAuth.signOut();
		navigate("/sign-in");
	}

	const userFirstName: string = props.userDbDoc.get("first_name");
	const userLastName: string = props.userDbDoc.get("last_name");

	return (
		<div
			className={`${open ? "w-72" : "w-5"
				} relative h-screen bg-sidebar_deep_green transition-width duration-300 ease-in-out overflow-hidden`}>
			<button
				className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white px-2 py-2 rounded-xl h-32 bg-sidebar_deep_green"
				style={{ zIndex: 10 }}
				onClick={() => setOpen(!open)}
			>
				{open ? "\u276E" : "\u276F"}
			</button>

			{open ? (
				<div className="flex flex-col h-full">
					{/* Fixed Logo and Welcome Section */}
					<div className="flex-shrink-0">
						<Link to="/">
							<img src={toadLogo} width={50} height={50} alt="toadLogo" className="justify-self-center mt-3"></img>
						</Link>
						<h1 className="text-center text-white font-sunflower text-lg py-4 px-4 pb-6">
							Welcome Back, {`${userFirstName} ${userLastName}`}
						</h1>
					</div>

					<div className="flex-grow overflow-y-auto">
						<h3 className="text-center text-white font-sunflower text-base px-4">
							Your Trips
						</h3>
						{turnUserListOfTripsIntoElems(userListOfTrips)}
						<div className="flex items-center bg-sidebar_deep_green px-14 py-2 mb-6 rounded-lg">
							<Link to="/create-trip" className="relative rounded-full h-7 w-7 flex items-center justify-center bg-[#4E6A55] text-white">
								+
							</Link>
							<span className="ml-2 pt-1 text-white text-sm font-sunflower">
								Create New Trip
							</span>
						</div>
						<h3 className="text-center text-white font-sunflower text-base px-4">
							Invitations
						</h3>
						{/* <InvitationButton name="Japan"></InvitationButton>
						<InvitationButton name="Europe 2024"></InvitationButton> */}
						{turnUserListOfInvitationsIntoElems(userListOfInvitations)}
					</div>

					<div className="flex-shrink-0 flex justify-center my-4">
						<button onClick={handleLogOut} className="relative flex items-center justify-center py-2 px-4 rounded-lg shadow-md w-4/5 max-w-xs">
							<span className="absolute rounded-lg inset-0 bg-[#D86D6D] opacity-75"></span>
							<span className="relative text-center text-white font-sunflower text-lg">
								Log Out
							</span>
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
}
