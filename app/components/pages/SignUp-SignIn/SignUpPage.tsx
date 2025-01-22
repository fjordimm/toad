import React, { useState } from 'react';
import emailicon from 'app/assets/mail.svg'
import lock from 'app/assets/lock.svg'
import globe from 'app/assets/globe.svg'
import person from 'app/assets/person.svg'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firebaseAuth, firebaseDb } from '../../../src/toadFirebase'
const SignUpPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        const user = userCredential.user;

        const emailLower = email.toLowerCase();
        /* Creates a user with their email as the identifier*/
        const userDocRef = doc(firebaseDb, 'users', emailLower);
        setDoc(userDocRef, {
            email: email,
            first_name: fname,
            last_name: lname,
        });
        //console.log({email: email, password: password, firstName: fname, lastName: lname});
        /*
        When the log in button is pressed, clear all fields. 
        */ 
        setEmail('');
        setPassword('');
        setFName('');
        setLName(''); 
        /*
        In the future, will need code to:
        - Create user account with Firebase authentication
        - Redirect user (using React Router) to the Log In page.
        */
    }

    return(
        <div className = "bigContainer">
            {/*logo*/}
            <div className = "logoClass">
                <h1 className="logoTitle">TOAD</h1>
                <img className="logoImg" src={globe}></img>
            </div>
            {/*subtitle*/}
            <p className="subtitleClass">To Outline A Destination</p>
            <div className="centerDiv">
                {/*already have account link to sign in page*/}
                <p className="noAccount">Already have an account?{" "} <a href="your-link-here" style={{ fontWeight: "bold", color: "white" }}>Sign In.</a></p>
                {/*form*/}
                <form className="formClass" onSubmit = {handleSubmit}>

                    {/*first name field*/}
                    <div className="inputContainer">
                        <img className="passwordImg" src={person}></img>
                        <input 
                        type="text" 
                        id = "fname" 
                        name = "fname"
                        value = {fname}
                        placeholder = "first name" 
                        className = "passwordInput" 
                        onChange={(e) => setFName(e.target.value)}
                        required>
                        </input>
                    </div>

                    {/*last name field*/}
                    <div className="inputContainer">
                        <img className="passwordImg" src={person}></img>
                        <input 
                        type="text" 
                        id = "lname" 
                        name = "lname"
                        value = {lname}
                        placeholder = "last name" 
                        className = "passwordInput" 
                        onChange={(e) => setLName(e.target.value)}
                        required>
                        </input>
                    </div>

                    {/*email field*/}
                    <div className="inputContainer">
                        <img className="passwordImg" src={emailicon}></img>
                        <input 
                        type="text" 
                        id = "email" 
                        name = "email"
                        placeholder = "email" 
                        value = {email}
                        className = "passwordInput" 
                        onChange={(e) => setEmail(e.target.value)}
                        required>
                        </input>
                    </div>

                    {/*password field*/}
                    <div className="inputContainer">
                        <img className="passwordImg" src={lock}></img>
                        <input 
                        type="password" 
                        id = "password" 
                        name = "password"
                        placeholder = "password" 
                        value = {password}
                        className = "passwordInput" 
                        onChange={(e) => setPassword(e.target.value)}
                        required>
                        </input>
                    </div>

                    {/*sign up button*/}
                    <div>
                        <button type="submit" className="formButton">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage