import calendarIcon from '/calendarIcon.svg';
import TripButton from './MenuBar/TripsButton'
import InvitationButton from './MenuBar/InvitationButton';
import { useEffect, useState, type ReactNode } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, DocumentReference, DocumentSnapshot, getDoc, onSnapshot } from 'firebase/firestore';
import { firebaseAuth, firebaseDb } from '~/src/toadFirebase';
import type { Route } from '../pages/+types/MainLayout';
import { Link, Navigate, redirect } from 'react-router';
import TripsButton from './MenuBar/TripsButton';
import Loading from './Loading';
import { dbRetrieveUsersListOfTrips } from '~/src/databaseUtil';
  
function logOut() {
	firebaseAuth.signOut();
}

function turnUserListOfTripsIntoElems(userListOfTrips: DocumentSnapshot[] | null): ReactNode {
	if (userListOfTrips !== null) {
		return userListOfTrips.map((trip: DocumentSnapshot) => {
			return <TripsButton tripDbDoc={trip} num={0} />
		});
	} else {
		return <Loading />;
	}
}

export default function MenuBar(props: { userDbDoc: DocumentSnapshot }) {

	console.log("MENU BAR RERENDERING");

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

	const userFirstName: string = props.userDbDoc.get("first_name");
	const userLastName: string = props.userDbDoc.get("last_name");

    return (
      <div
        className={`${
          open ? "w-72" : "w-5"
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
              <h1 className="text-center">Insert Logo Here :3</h1>
              <h1 className="text-center text-white font-sunflower text-lg py-4 px-4 pb-6">
                Welcome Back, {props.name}
              </h1>
            </div>
  
            <div className="flex-grow overflow-y-auto">
              <h3 className="text-center text-white font-sunflower text-base px-4">
                Your Trips
              </h3>
              <TripButton name="Portland" num={0}></TripButton>
              <TripButton name="Tahoe" num={1}></TripButton>
              <TripButton name="Tahoe" num={1}></TripButton>
              <TripButton name="Tahoe" num={1}></TripButton>
              <TripButton name="Tahoe" num={1}></TripButton>
              <TripButton name="Tahoe" num={1}></TripButton>
              <TripButton name="Tahoe" num={1}></TripButton>
              <TripButton name="Tahoe" num={1}></TripButton>
              <div className="flex items-center bg-sidebar_deep_green px-14 py-2 mb-6 rounded-lg">
                <button className="relative rounded-full h-7 w-7 flex items-center justify-center bg-[#4E6A55] text-white">
                  +
                </button>
                <span className="ml-2 pt-1 text-white text-sm font-sunflower">
                  Create New Trip
                </span>
              </div>
              <h3 className="text-center text-white font-sunflower text-base px-4">
                Invitations
              </h3>
              <InvitationButton name="Japan"></InvitationButton>
              <InvitationButton name="Europe 2024"></InvitationButton>
            </div>
  
            <div className="flex-shrink-0 flex justify-center my-4">
              <button className="relative flex items-center justify-center py-2 px-4 rounded-lg shadow-md w-4/5 max-w-xs">
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
