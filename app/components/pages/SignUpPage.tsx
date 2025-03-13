/*
 Description:
  The page (with url '/sign-up') for creating a new account.
 
 Interactions:
  - Parent Component(s): TopLevelLayout (as Outlet)
  - Direct Children Component(s): none
  - Database: Firebase Authentication, Firestore writes
*/

import React from "react";
import { useState } from 'react';
import emailicon from '/mail.svg';
import lock from '/lock.svg';
import person from '/person.svg';
import { firebaseAuth, firebaseDb } from '../../src/toadFirebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router';
import { debugLogComponentRerender } from '~/src/debugUtil';
import logo from "/toadLogo.svg";
import { FirebaseError } from "firebase/app";

export default function SignUpPage() {

    debugLogComponentRerender("SignUpPage");

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    const [error, setError] = useState('');

    function isValidEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            if (!isValidEmail(email)) {
                setError("Please enter a valid email!");
            } else {
                await createUserWithEmailAndPassword(firebaseAuth, email, password);

                const emailLower = email.toLowerCase();
                /* Creates a user with their email as the identifier */
                const userDocRef = doc(firebaseDb, "users", emailLower);
                await setDoc(userDocRef, {
                    email: email,
                    first_name: fname,
                    last_name: lname,
                    trips: [],
                    trip_invites: []
                });

                navigate("/sign-in");
            }
        } catch (err: any) {
            if (err instanceof FirebaseError) {
                if (err.code === "auth/email-already-in-use") {
                    setError("Email already in use!");
                } else if (err.code === "auth/invalid-email") {
                    setError("Please enter a valid email!");
                } else if (err.code === "auth/weak-password") {
                    setError("Your password is too weak!");
                } else {
                    setError("An unknown error has occurred!");
                    console.log("An unknown Firebase error occurred while trying to add a new user:");
                    console.log(err);
                }
            } else {
                setError("An unknown error has occurred!");
                console.log("An unknown error occurred while trying to add a new user:");
                console.log(err);
            }
        }
    }

    return (
        <div className="bg-background-green-gradient w-screen h-screen flex items-center justify-center">
            {/* Big Container Div */}
            <div className="flex flex-col items-center">
                {/* Logo: Title and image */}
                <div className="flex flex-row">
                    <h1 className="font-lilita text-9xl text-white">TOAD</h1>
                    <img src={logo} alt="Toad Logo" className="ml-6 w-32 h-32"></img>
                </div>
                {/* Subtitle */}
                <div className="mt-4 font-sunflower text-3xl text-white justify-center">
                    <p>To Outline a Destination</p>
                </div>
                {/* No Account */}
                <div className="mt-4 font-sunflower text-lg text-white justify-center">
                    <p>Already Have an Account? <a href="/sign-in" className="underline">Sign In</a></p>
                </div>
                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-4 gap-y-4 flex flex-col justify-center">
                    {/* First Name */}
                    <div className="flex flex-row w-80 h-12 bg-white/20 rounded-xl focus-within:ring-[#FFF]/40 focus-within:ring-2 items-center">
                        <img src={person} alt="Person Icon" className="w-9 h-9 ml-2" ></img>
                        <input
                            className="mb-1 mx-4 w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower text-xl focus:outline-none border-b-2 border-[#FFF]/50"
                            type="text"
                            id="fname"
                            value={fname}
                            name="fname"
                            placeholder="first name"
                            onChange={(e) => setFName(e.target.value)}
                            required
                        ></input>
                    </div>
                    {/* Last Name */}
                    <div className="flex flex-row w-80 h-12 bg-white/20 rounded-xl focus-within:ring-[#FFF]/40 focus-within:ring-2 items-center">
                        <img src={person} alt="Person Icon" className="w-9 h-9 ml-2" ></img>
                        <input
                            className="mb-1 mx-4 w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower text-xl focus:outline-none border-b-2 border-[#FFF]/50"
                            type="text"
                            id="lname"
                            value={lname}
                            name="lname"
                            placeholder="last name"
                            onChange={(e) => setLName(e.target.value)}
                            required
                        ></input>
                    </div>
                    {/* Email */}
                    <div className="flex flex-row w-80 h-12 bg-white/20 rounded-xl focus-within:ring-[#FFF]/40 focus-within:ring-2 items-center">
                        <img src={emailicon} alt="Email Icon" className="w-9 h-9 ml-2" ></img>
                        <input
                            className="mb-1 mx-4 w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower text-xl focus:outline-none border-b-2 border-[#FFF]/50"
                            type="text"
                            id="email"
                            value={email}
                            name="email"
                            placeholder="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        ></input>
                    </div>
                    {/* Password */}
                    <div className="flex flex-row w-80 h-12 bg-white/20 rounded-xl focus-within:ring-[#FFF]/40 focus-within:ring-2 items-center">
                        <img src={lock} alt="Email Icon" className="w-9 h-9 ml-2" ></img>
                        <input
                            className="mb-1 mx-4 w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower text-xl focus:outline-none border-b-2 border-[#FFF]/50"
                            type="password"
                            id="password"
                            value={password}
                            name="password"
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        ></input>
                    </div>
                    {/* Submit Button */}
                    <div className="flex flex-row w-80 h-12 bg-[#728D5F] rounded-xl focus-within:ring-[#FFF]/40 focus-within:ring-2 items-center">
                        <button
                            className="mx-4 w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower text-xl focus:outline-none"
                            type="submit"
                        >Submit</button>
                    </div>
                    <p className="font-maven text-red-400 width-2 text-center">{error}</p>
                </form>
            </div>
        </div>
    );
}
