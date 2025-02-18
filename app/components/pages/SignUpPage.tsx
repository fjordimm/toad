import React from "react";
import { useState } from 'react';
import emailicon from '/mail.svg';
import lock from '/lock.svg';
import globe from '/globe.svg';
import person from '/person.svg';
import { firebaseAuth, firebaseDb } from '../../src/toadFirebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router';
import { debugLogComponentRerender } from '~/src/debugUtil';

const SignUpPage = () => {

    debugLogComponentRerender("SignUpPage");

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    const [error, setError] = useState('');

    // TODO: handle weak password error (and any other errors from createUserWithEmailAndPassword)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const user = userCredential.user;

            const emailLower = email.toLowerCase();
            /* Creates a user with their email as the identifier*/
            const userDocRef = doc(firebaseDb, "users", emailLower);
            await setDoc(userDocRef, {
                email: email,
                first_name: fname,
                last_name: lname,
                trips: [],
                trip_invites: []
            });

            // Removed this in place of arrays
            /*This creates new empty collections for user trips and invited trips. Can also do with an array, but did with a collection for now*/
            // await addDoc(collection(firebaseDb, "users", emailLower, "trips"), {
            //     placeholder: "",      
            // });
            // await addDoc(collection(firebaseDb, "users", emailLower, "trip_invites"), {
            //     placeholder: "",      
            // });

            navigate("/sign-in");

        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') {
                setError('Email already in use! Sign In.');
            }
        }
        setEmail('');
        setPassword('');
        setFName('');
        setLName('');
        /*
        In the future, will need code to:
        - Redirect user (using React Router) to the Log In page.
        */
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "linear-gradient(180deg, #87A26A 0%, #3D5941 89%, #2B4737 100%)",
        }}>
            {/*logo*/}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <h1 className="font-lilita" style={{ color: "white", fontSize: "5em", }}>TOAD</h1>
                <img style={{
                    width: "5em",
                    height: "5em",
                    marginLeft: "30px",
                }} src={globe}></img>
            </div>
            {/*subtitle*/}
            <p className="font-maven"
                style={{
                    color: "white",
                    fontSize: "2em",
                    marginTop: "-10px",
                    marginBottom: "50px",
                }}>To Outline A Destination</p>
            <div style={{ justifyItems: "center", alignItems: "center", marginTop: "-30px" }}>
                {/*already have account link to sign in page*/}
                <p className="font-maven text-white">Already have an account?{" "} <a href="/sign-in" className="font-bold text-white underline">Sign In.</a></p>
                {/*form*/}
                <form style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "15px",
                    width: "80%",
                    color: "white",
                    marginTop: "10px"
                }}
                    className="font-sunflower"
                    onSubmit={handleSubmit}>

                    {/*first name field*/}
                    <div style={{ display: "flex", alignItems: "center", borderRadius: "10px", width: "300px", height: "50px", border: "none", backgroundColor: "rgba(255, 255, 255, 0.2)", }}>
                        <img src={person} style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "auto 10px", width: "30px", height: "30px" }}></img>
                        <input
                            type="text"
                            id="fname"
                            name="fname"
                            value={fname}
                            placeholder="first name"
                            className="sunflower"
                            style={{ marginLeft: "12px", backgroundColor: "transparent", border: "none", outline: "none", color: "white", borderBottom: "2px solid rgba(255, 255, 255, 0.5)", fontSize: "20px" }}
                            onChange={(e) => setFName(e.target.value)}
                            required>
                        </input>
                    </div>

                    {/*last name field*/}
                    <div style={{ display: "flex", alignItems: "center", borderRadius: "10px", width: "300px", height: "50px", border: "none", backgroundColor: "rgba(255, 255, 255, 0.2)", }}>
                        <img src={person} style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "auto 10px", width: "30px", height: "30px" }}></img>
                        <input
                            type="text"
                            id="lname"
                            name="lname"
                            value={lname}
                            placeholder="last name"
                            className="font-sunflower"
                            style={{ marginLeft: "12px", backgroundColor: "transparent", border: "none", outline: "none", color: "white", borderBottom: "2px solid rgba(255, 255, 255, 0.5)", fontSize: "20px" }}
                            onChange={(e) => setLName(e.target.value)}
                            required>
                        </input>
                    </div>

                    {/*email field*/}
                    <div style={{ display: "flex", alignItems: "center", borderRadius: "10px", width: "300px", height: "50px", border: "none", backgroundColor: "rgba(255, 255, 255, 0.2)", }}>
                        <img src={emailicon} style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "auto 10px", width: "30px", height: "30px" }}></img>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="email"
                            value={email}
                            className="font-sunflower"
                            style={{ marginLeft: "12px", backgroundColor: "transparent", border: "none", outline: "none", color: "white", borderBottom: "2px solid rgba(255, 255, 255, 0.5)", fontSize: "20px" }}
                            onChange={(e) => setEmail(e.target.value)}
                            required>
                        </input>
                    </div>

                    {/*password field*/}
                    <div style={{ display: "flex", alignItems: "center", borderRadius: "10px", width: "300px", height: "50px", border: "none", backgroundColor: "rgba(255, 255, 255, 0.2)", }}>
                        <img src={lock} style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "auto 10px", width: "30px", height: "30px" }}></img>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="password"
                            value={password}
                            className="font-sunflower"
                            style={{ marginLeft: "12px", backgroundColor: "transparent", border: "none", outline: "none", color: "white", borderBottom: "2px solid rgba(255, 255, 255, 0.5)", fontSize: "20px" }}
                            onChange={(e) => setPassword(e.target.value)}
                            required>
                        </input>
                    </div>

                    {/*sign up button*/}
                    <div>
                        <button type="submit" className="font-sunflower" style={{ width: "300px", height: "50px", padding: "10px", backgroundColor: "#728D5F", borderRadius: "10px", border: "none", color: "white", fontSize: "16px" }}>Sign Up</button>
                    </div>
                    <p className="font-maven text-red-400 width-2 text-center">{error}</p>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage