import calendarIcon from '/calendarIcon.svg';
import TripButton from './MenuBar/TripsButton'
import InvitationButton from './MenuBar/InvitationButton';
import { useState } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, DocumentSnapshot, getDoc } from 'firebase/firestore';
import { firebaseAuth, firebaseDb } from '~/src/toadFirebase';
import type { Route } from '../pages/+types/MainLayout';
import { authenticateUser } from '~/src/userAuthenticationUtil';
import { Navigate } from 'react-router';

function logOut() {
	console.log("AHHHHHHHHHHHHHHH SIGN SODUIOUEROTIUEIOTUIOJ");
	firebaseAuth.signOut();
}

export default function MenuBar(props: { name: string }) {

	// console.log("Yipeeeee");
	// const fireauthUser = getAuth().currentUser;
	// console.log(getAuth().currentUser);
	// const bruh: string = fireauthUser?.email as string;
	// console.log(bruh);
	// const asdfhsdjfh: string = "billmularski@gmail.com";
	// const docThing = getDoc(doc(firebaseDb, 'users', bruh));
	// docThing.then((result) => { console.log(result.data()) });

	// onAuthStateChanged(getAuth(), (authUser: User | null) => {
	// 	if (authUser !== null) {
	// 		console.log("Bro is logged in:");

	// 		const emailId: string = authUser.email as string;
	// 		console.log(`Email: ${emailId}`);

	// 		const docPromise: Promise<DocumentSnapshot> = getDoc(doc(firebaseDb, "users", emailId));
	// 		docPromise.then((result: DocumentSnapshot) => {
	// 			console.log(result.data()?.first_name);
	// 		});
	// 	} else {
	// 		console.log("Bro is NOT logged in.");
	// 	}
	// });

	// return <Navigate to="/sign-in" />;
    
    const [open, setOpen] = useState(true);

    return (
        <div className={`${
            open ? "w-72" : "w-5"
          } relative h-screen bg-sidebar_deep_green transition-width duration-300 ease-in-out`}>
            <button className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white px-2 py-2 rounded-xl -mr-4 h-32 bg-sidebar_deep_green"
            onClick={()=>setOpen(!open)}>
            {open ? "\u276E" : "\u276F"}</button>
            {open ? (
            <div>
                <h1 className="text-center">Insert Logo Here :3</h1>
                <h1 className='text-center text-white font-sunflower text-lg py-4 px-4 pb-14'>Welcome Back, {props.name}</h1>
                <h3 className='text-center text-white font-sunflower text-base px-4'>Your Trips</h3>
                <TripButton name="Portland" num={0}></TripButton>
                <TripButton name="Tahoe" num={1}></TripButton>
                <div className="flex items-center bg-sidebar_deep_green px-14 py-2 mb-24 rounded-lg">
                    <button className='relative rounded-full h-7 w-7 flex items-center justify-center bg-[#4E6A55] text-white'>+</button>
                    <span className="ml-2 pt-1 text-white text-sm font-sunflower">Create New Trip</span>
                </div>
                <h3 className='text-center text-white font-sunflower text-base px-4'>Invitations</h3>
                <InvitationButton name="Japan"></InvitationButton>
                <InvitationButton name="Europe 2024"></InvitationButton>

                <div className='flex justify-center my-4 pt-24'>
                {/* <a href="/sign-in" className='relative flex items-center justify-center py-2 px-4 rounded-lg shadow-md w-4/5 max-w-xs'>
                    <span className='absolute rounded-lg inset-0 bg-[#D86D6D] opacity-75'></span>
                    <span className='relative text-center text-white font-sunflower text-lg'>Log Out</span>
                </a> */}
				<button onClick={logOut} className='relative flex items-center justify-center py-2 px-4 rounded-lg shadow-md w-4/5 max-w-xs'>
                    <span className='absolute rounded-lg inset-0 bg-[#D86D6D] opacity-75'></span>
                    <span className='relative text-center text-white font-sunflower text-lg'>Log Out</span>
                </button>
            </div>
            </div>
            ) : null}
        </div>
    )

}