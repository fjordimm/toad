import calendarIcon from '/calendarIcon.svg';
import TripButton from './MenuBar/TripsButton'
import InvitationButton from './MenuBar/InvitationButton';
import { useState, type ReactNode } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, DocumentSnapshot, getDoc } from 'firebase/firestore';
import { firebaseAuth, firebaseDb } from '~/src/toadFirebase';
import type { Route } from '../pages/+types/MainLayout';
import { authenticateUser, retrieveTripDbDocs } from '~/src/databaseUtil';
import { Link, Navigate, redirect } from 'react-router';
import TripsButton from './MenuBar/TripsButton';
import Loading from './Loading';

function logOut() {
	firebaseAuth.signOut();
}

function turnTripDbDocsIntoElems(tripDbDocs: DocumentSnapshot[] | null): ReactNode {
	if (tripDbDocs != null) {
		return tripDbDocs.map((trip: DocumentSnapshot) => {
			return <TripsButton num={0} name="Test trip" />
		})
	} else {
		return <Loading />;
	}
}

export default function MenuBar(props: { userDbDoc: DocumentSnapshot }) {
    
    const [open, setOpen] = useState(true);

	const [tripDbDocs, setTripDbDocs] = useState<DocumentSnapshot[] | null>(null);
	retrieveTripDbDocs(props.userDbDoc).then(
		(result: DocumentSnapshot[] | null) => {
			setTripDbDocs(result);
		}
	);

    return (
        <div className={`${
            open ? "w-72" : "w-5"
          } relative h-screen bg-sidebar_deep_green transition-width duration-300 ease-in-out`}>
            <button className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white px-2 py-2 rounded-xl -mr-4 h-32 bg-sidebar_deep_green"
            onClick={()=>setOpen(!open)}>
            {open ? "\u276E" : "\u276F"}</button>
            {open ? (
            <div>
				<Link to="/">
					<h1 className="text-center">Insert Logo Here :3</h1>
				</Link>
                <h1 className='text-center text-white font-sunflower text-lg py-4 px-4 pb-14'>Welcome Back, {`${props.userDbDoc.data()?.first_name} ${props.userDbDoc.data()?.last_name}`}</h1>
                <h3 className='text-center text-white font-sunflower text-base px-4'>Your Trips</h3>
                <div className="flex flex-col my-4 gap-y-4">
					{ turnTripDbDocsIntoElems(tripDbDocs) }
				</div>
                <div className="flex items-center bg-sidebar_deep_green px-14 py-2 mb-24 rounded-lg">
                    <Link to="/create-trip" className='relative rounded-full h-7 w-7 flex items-center justify-center bg-[#4E6A55] text-white'>+</Link>
                    <span className="ml-2 pt-1 text-white text-sm font-sunflower">Create New Trip</span>
                </div>
                <h3 className='text-center text-white font-sunflower text-base px-4'>Invitations</h3>
                <InvitationButton name="Japan"></InvitationButton>
                <InvitationButton name="Europe 2024"></InvitationButton>

                <div className='flex justify-center my-4 pt-24'>
				<Link to="/sign-in" onClick={logOut} className='relative flex items-center justify-center py-2 px-4 rounded-lg shadow-md w-4/5 max-w-xs'>
                    <span className='absolute rounded-lg inset-0 bg-[#D86D6D] opacity-75'></span>
                    <span className='relative text-center text-white font-sunflower text-lg'>Log Out</span>
                </Link>
            </div>
            </div>
            ) : null}
        </div>
    )

}
