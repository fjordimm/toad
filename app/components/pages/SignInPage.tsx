import React from "react";
import { useState } from 'react';
import emailicon from '/mail.svg'
import lock from '/lock.svg'
import globe from '/globe.svg'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '../../src/toadFirebase'
import { useNavigate } from 'react-router';
import { debugLogComponentRerender } from '~/src/debugUtil';

export default function SignInPage() {

    debugLogComponentRerender("SignInPage");

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function isValidEmail(email:string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {

            if(!isValidEmail(email)) {
                setError("Please enter a valid email!");
                setEmail("");
                setPassword("");
            }
            // TODO: Unused code here? I commented it out.
            await signInWithEmailAndPassword(firebaseAuth, email, password);

            setEmail('');
            setPassword('');
            setError('');

            navigate("/");
            
        } catch (err: any) {
            if (err.code === 'auth/user-not-found') {
                setError('The email you entered does not belong to any account!');
                setEmail('');
                setPassword('');
            } else if (err.code === 'auth/wrong-password') {
                setError('The password you entered is incorrect.');
                setPassword('');
            }
        }
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
                    <p>Don't Have an Account? <a href = "/sign-up" className = "underline">Sign Up</a></p>
                </div>
                {/* Form */}
                <form onSubmit = {handleSubmit} className = "mt-4 gap-y-4 flex flex-col items-center justify-center">
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
    //     <div
    //         style={{
    //             display: "flex",
    //             flexDirection: "column",
    //             justifyContent: "center",
    //             alignItems: "center",
    //             height: "100vh",
    //             background: "linear-gradient(180deg, #87A26A 0%, #3D5941 89%, #2B4737 100%)",
    //         }}
    //     >
    //         {/* logo */}
    //         <div
    //             style={{
    //                 display: "flex",
    //                 alignItems: "center",
    //                 justifyContent: "center"
    //             }}
    //         >
    //             <h1
    //                 className="font-lilita"
    //                 style={{
    //                     color: "white",
    //                     fontSize: "5em",
    //                 }}
    //             >
    //                 TOAD
    //             </h1>
    //             <img
    //                 src={globe}
    //                 alt="Globe"
    //                 style={{
    //                     width: "5em",
    //                     height: "5em",
    //                     marginLeft: "30px",
    //                 }}
    //             />
    //         </div>

    //         {/* subtitle */}
    //         <p
    //             className="font-maven"
    //             style={{
    //                 color: "white",
    //                 fontSize: "2em",
    //                 marginTop: "-10px",
    //                 marginBottom: "50px",
    //             }}
    //         >
    //             To Outline A Destination
    //         </p>

    //         <div
    //             style={{
    //                 justifyItems: "center",
    //             }}
    //         >
    //             {/* already have account link */}
    //             <p className="font-maven" style={{ color: "white" }}>
    //                 Don&apos;t have an account?{" "}
    //                 <a
    //                     href="/sign-up"
    //                     style={{
    //                         fontWeight: "bold",
    //                         color: "white",
    //                     }}
    //                 >
    //                     Sign Up.
    //                 </a>
    //             </p>

    //             {/* form */}
    //             <form
    //                 onSubmit={handleSubmit}
    //                 style={{
    //                     display: "flex",
    //                     flexDirection: "column",
    //                     alignItems: "center",
    //                     gap: "15px",
    //                     width: "80%",
    //                     color: "white",
    //                     marginTop: "10px"
    //                 }}
    //                 className="font-sunflower"
    //             >
    //                 {/* email field */}
    //                 <div
    //                     style={{
    //                         display: "flex",
    //                         alignItems: "center",
    //                         borderRadius: "10px",
    //                         width: "300px",
    //                         height: "50px",
    //                         backgroundColor: "rgba(255, 255, 255, 0.2)",
    //                     }}
    //                 >
    //                     <img
    //                         src={emailicon}
    //                         alt="Email Icon"
    //                         style={{
    //                             display: "flex",
    //                             alignItems: "center",
    //                             justifyContent: "center",
    //                             margin: "auto 10px",
    //                             width: "30px",
    //                             height: "30px",
    //                         }}
    //                     />
    //                     <input
    //                         type="text"
    //                         id="email"
    //                         value={email}
    //                         name="email"
    //                         placeholder="email"
    //                         onChange={(e) => setEmail(e.target.value)}
    //                         required
    //                         style={{
    //                             marginLeft: "12px",
    //                             backgroundColor: "transparent",
    //                             border: "none",
    //                             outline: "none",
    //                             color: "white",
    //                             fontFamily: "'Sunflower', serif",
    //                             borderBottom: "2px solid rgba(255, 255, 255, 0.5)",
    //                             fontSize: "20px",
    //                         }}
    //                     />
    //                 </div>

    //                 {/* password field */}
    //                 <div
    //                     style={{
    //                         display: "flex",
    //                         alignItems: "center",
    //                         borderRadius: "10px",
    //                         width: "300px",
    //                         height: "50px",
    //                         backgroundColor: "rgba(255, 255, 255, 0.2)",
    //                     }}
    //                 >
    //                     <img
    //                         src={lock}
    //                         alt="Lock Icon"
    //                         style={{
    //                             display: "flex",
    //                             alignItems: "center",
    //                             justifyContent: "center",
    //                             margin: "auto 10px",
    //                             width: "30px",
    //                             height: "30px",
    //                         }}
    //                     />
    //                     <input
    //                         type="password"
    //                         id="password"
    //                         value={password}
    //                         name="password"
    //                         placeholder="password"
    //                         onChange={(e) => setPassword(e.target.value)}
    //                         required
    //                         style={{
    //                             marginLeft: "12px",
    //                             backgroundColor: "transparent",
    //                             border: "none",
    //                             outline: "none",
    //                             color: "white",
    //                             fontFamily: "'Sunflower', serif",
    //                             borderBottom: "2px solid rgba(255, 255, 255, 0.5)",
    //                             fontSize: "20px",
    //                         }}
    //                     />
    //                 </div>

    //                 {/* login button */}
    //                 <button
    //                     type="submit"
    //                     style={{
    //                         width: "300px",
    //                         height: "50px",
    //                         padding: "10px",
    //                         backgroundColor: "#728D5F",
    //                         fontFamily: "'Sunflower', serif",
    //                         borderRadius: "10px",
    //                         border: "none",
    //                         color: "white",
    //                         fontSize: "16px",
    //                     }}
    //                 >
    //                     Log In
    //                 </button>
    //                 <p className="font-maven text-red-400 width-2 text-center">{error}</p>
    //             </form>
    //         </div>
    //     </div>
    // );
}
