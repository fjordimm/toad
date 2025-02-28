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

    function isValidEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {

            if (!isValidEmail(email)) {
                setError("Please enter a valid email!");
                setEmail("");
                setPassword("");
            }

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

    return (
        <div className="bg-background-green-gradient w-screen h-screen flex items-center justify-center">
            {/* Big Container Div */}
            <div className="flex flex-col items-center">
                {/* Logo: Title and image */}
                <div className="flex flex-row">
                    <h1 className="font-lilita text-9xl text-white">TOAD</h1>
                    <img src={globe} alt="Toad Logo" className="ml-6 w-32 h-32"></img>
                </div>
                {/* Subtitle */}
                <div className="mt-4 font-sunflower text-3xl text-white justify-center">
                    <p>To Outline a Destination</p>
                </div>
                {/* No Account */}
                <div className="mt-4 font-sunflower text-lg text-white justify-center">
                    <p>Don't Have an Account? <a href="/sign-up" className="underline">Sign Up</a></p>
                </div>
                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-4 gap-y-4 flex flex-col items-center justify-center">
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
