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

export default function SignUpPage() {

    debugLogComponentRerender("SignUpPage");

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    const [error, setError] = useState('');

    function isValidEmail(email:string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // TODO: handle weak password error (and any other errors from createUserWithEmailAndPassword)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {

            if(!isValidEmail(email)) {
                setError("Please enter a valid email!");
                setFName("");
                setLName("");
                setEmail("");
                setPassword("");
            }

            await createUserWithEmailAndPassword(firebaseAuth, email, password);

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

    return(
        <div className="bg-background-green-gradient w-screen h-screen flex items-center justify-center">
            {/* Big Container Div */}
            <div className="flex flex-col items-center">
                {/* Logo: Title and image */}
                <div className = "flex flex-row">
                    <h1 className = "font-lilita text-9xl text-white">TOAD</h1>
                    <img src={globe} alt="Toad Logo" className = "ml-6 w-32 h-32"></img>
                </div>
                {/* Subtitle */}
                <div className = "mt-4 font-sunflower text-3xl text-white justify-center">
                    <p>To Outline a Destination</p>
                </div>
                {/* No Account */}
                <div className = "mt-4 font-sunflower text-lg text-white justify-center">
                    <p>Already Have an Account? <a href = "/sign-in" className = "underline">Sign In</a></p>
                </div>
                {/* Form */}
                <form onSubmit = {handleSubmit} className = "mt-4 gap-y-4 flex flex-col justify-center">
                    {/* First Name */}
                    <div className = "flex flex-row w-80 h-12 bg-white/20 rounded-xl focus-within:ring-[#FFF]/40 focus-within:ring-2 items-center">
                        <img src = {person} alt = "Person Icon" className = "w-9 h-9 ml-2" ></img>
                        <input 
                        className = "mb-1 mx-4 w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower text-xl focus:outline-none border-b-2 border-[#FFF]/50"
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
                    <div className = "flex flex-row w-80 h-12 bg-white/20 rounded-xl focus-within:ring-[#FFF]/40 focus-within:ring-2 items-center">
                        <img src = {person} alt = "Person Icon" className = "w-9 h-9 ml-2" ></img>
                        <input 
                        className = "mb-1 mx-4 w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower text-xl focus:outline-none border-b-2 border-[#FFF]/50"
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
                    <div className = "flex flex-row w-80 h-12 bg-white/20 rounded-xl focus-within:ring-[#FFF]/40 focus-within:ring-2 items-center">
                        <img src = {emailicon} alt = "Email Icon" className = "w-9 h-9 ml-2" ></img>
                        <input 
                        className = "mb-1 mx-4 w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower text-xl focus:outline-none border-b-2 border-[#FFF]/50"
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
                    <div className = "flex flex-row w-80 h-12 bg-white/20 rounded-xl focus-within:ring-[#FFF]/40 focus-within:ring-2 items-center">
                        <img src = {lock} alt = "Email Icon" className = "w-9 h-9 ml-2" ></img>
                        <input 
                        className = "mb-1 mx-4 w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower text-xl focus:outline-none border-b-2 border-[#FFF]/50"
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
                    <div className = "flex flex-row w-80 h-12 bg-[#728D5F] rounded-xl focus-within:ring-[#FFF]/40 focus-within:ring-2 items-center">
                        <button 
                        className = "mx-4 w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower text-xl focus:outline-none"
                        type="submit"
                        >Submit</button>
                    </div>
                    <p className="font-maven text-red-400 width-2 text-center">{error}</p>
                </form>
            </div>
        </div>
    );

    // return (
    //     <div style={{
    //         display: "flex",
    //         flexDirection: "column",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         height: "100vh",
    //         background: "linear-gradient(180deg, #87A26A 0%, #3D5941 89%, #2B4737 100%)",
    //     }}>
    //         {/*logo*/}
    //         <div style={{
    //             display: "flex",
    //             alignItems: "center",
    //             justifyContent: "center"
    //         }}>
    //             <h1 className="font-lilita" style={{ color: "white", fontSize: "5em", }}>TOAD</h1>
    //             <img style={{
    //                 width: "5em",
    //                 height: "5em",
    //                 marginLeft: "30px",
    //             }} src={globe}></img>
    //         </div>
    //         {/*subtitle*/}
    //         <p className="font-maven"
    //             style={{
    //                 color: "white",
    //                 fontSize: "2em",
    //                 marginTop: "-10px",
    //                 marginBottom: "50px",
    //             }}>To Outline A Destination</p>
    //         <div style={{ justifyItems: "center", alignItems: "center", marginTop: "-30px" }}>
    //             {/*already have account link to sign in page*/}
    //             <p className="font-maven text-white">Already have an account?{" "} <a href="/sign-in" className="font-bold text-white underline">Sign In.</a></p>
    //             {/*form*/}
    //             <form style={{
    //                 display: "flex",
    //                 flexDirection: "column",
    //                 alignItems: "center",
    //                 gap: "15px",
    //                 width: "80%",
    //                 color: "white",
    //                 marginTop: "10px"
    //             }}
    //                 className="font-sunflower"
    //                 onSubmit={handleSubmit}>

    //                 {/*first name field*/}
    //                 <div style={{ display: "flex", alignItems: "center", borderRadius: "10px", width: "300px", height: "50px", border: "none", backgroundColor: "rgba(255, 255, 255, 0.2)", }}>
    //                     <img src={person} style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "auto 10px", width: "30px", height: "30px" }}></img>
    //                     <input
    //                         type="text"
    //                         id="fname"
    //                         name="fname"
    //                         value={fname}
    //                         placeholder="first name"
    //                         className="sunflower"
    //                         style={{ marginLeft: "12px", backgroundColor: "transparent", border: "none", outline: "none", color: "white", borderBottom: "2px solid rgba(255, 255, 255, 0.5)", fontSize: "20px" }}
    //                         onChange={(e) => setFName(e.target.value)}
    //                         required>
    //                     </input>
    //                 </div>

    //                 {/*last name field*/}
    //                 <div style={{ display: "flex", alignItems: "center", borderRadius: "10px", width: "300px", height: "50px", border: "none", backgroundColor: "rgba(255, 255, 255, 0.2)", }}>
    //                     <img src={person} style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "auto 10px", width: "30px", height: "30px" }}></img>
    //                     <input
    //                         type="text"
    //                         id="lname"
    //                         name="lname"
    //                         value={lname}
    //                         placeholder="last name"
    //                         className="font-sunflower"
    //                         style={{ marginLeft: "12px", backgroundColor: "transparent", border: "none", outline: "none", color: "white", borderBottom: "2px solid rgba(255, 255, 255, 0.5)", fontSize: "20px" }}
    //                         onChange={(e) => setLName(e.target.value)}
    //                         required>
    //                     </input>
    //                 </div>

    //                 {/*email field*/}
    //                 <div style={{ display: "flex", alignItems: "center", borderRadius: "10px", width: "300px", height: "50px", border: "none", backgroundColor: "rgba(255, 255, 255, 0.2)", }}>
    //                     <img src={emailicon} style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "auto 10px", width: "30px", height: "30px" }}></img>
    //                     <input
    //                         type="text"
    //                         id="email"
    //                         name="email"
    //                         placeholder="email"
    //                         value={email}
    //                         className="font-sunflower"
    //                         style={{ marginLeft: "12px", backgroundColor: "transparent", border: "none", outline: "none", color: "white", borderBottom: "2px solid rgba(255, 255, 255, 0.5)", fontSize: "20px" }}
    //                         onChange={(e) => setEmail(e.target.value)}
    //                         required>
    //                     </input>
    //                 </div>

    //                 {/*password field*/}
    //                 <div style={{ display: "flex", alignItems: "center", borderRadius: "10px", width: "300px", height: "50px", border: "none", backgroundColor: "rgba(255, 255, 255, 0.2)", }}>
    //                     <img src={lock} style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "auto 10px", width: "30px", height: "30px" }}></img>
    //                     <input
    //                         type="password"
    //                         id="password"
    //                         name="password"
    //                         placeholder="password"
    //                         value={password}
    //                         className="font-sunflower"
    //                         style={{ marginLeft: "12px", backgroundColor: "transparent", border: "none", outline: "none", color: "white", borderBottom: "2px solid rgba(255, 255, 255, 0.5)", fontSize: "20px" }}
    //                         onChange={(e) => setPassword(e.target.value)}
    //                         required>
    //                     </input>
    //                 </div>

    //                 {/*sign up button*/}
    //                 <div>
    //                     <button type="submit" className="font-sunflower" style={{ width: "300px", height: "50px", padding: "10px", backgroundColor: "#728D5F", borderRadius: "10px", border: "none", color: "white", fontSize: "16px" }}>Sign Up</button>
    //                 </div>
    //                 <p className="font-maven text-red-400 width-2 text-center">{error}</p>
    //             </form>
    //         </div>
    //     </div>
    // );
}
