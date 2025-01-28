import React, { useState } from 'react';
import emailicon from '/mail.svg'
import lock from '/lock.svg'
import globe from '/globe.svg'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseAuth, firebaseDb } from '../../src/toadFirebase'
import { Form, useNavigate } from 'react-router';

const SignInPage = () => {

	console.log("SIGN IN RERENDERING");

	const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
            const user = userCredential.user;

            const normalizedEmail = email.toLowerCase(); // Ensure email matches Firestore document ID format
            const userDocRef = doc(firebaseDb, 'users', normalizedEmail);
            const userDocSnap = await getDoc(userDocRef);

            // if (userDocSnap.exists()) {
            //     const userData = userDocSnap.data();
            //     console.log(`First Name: ${userData.first_name}, Last Name: ${userData.last_name}`);
            // } else {
            //     console.error('No user data found in Firestore for this email.');
            // }
            setEmail('');
            setPassword('');
            setError('');

			navigate("/");
        } catch (err: any) {
            if(err.code === 'auth/user-not-found') {
                setError('The email you entered does not belong to any account!');
                setEmail('');
                setPassword('');
            } else if(err.code === 'auth/wrong-password') {
                setError('The password you entered is incorrect.');
                setPassword('');
            }
        }
    }

    return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "linear-gradient(180deg, #87A26A 0%, #3D5941 89%, #2B4737 100%)",
          }}
        >
          {/* logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <h1
              className="font-lilita"
              style={{
                color: "white",
                fontSize: "5em",
              }}
            >
              TOAD
            </h1>
            <img
              src={globe}
              alt="Globe"
              style={{
                width: "5em",
                height: "5em",
                marginLeft: "30px",
              }}
            />
          </div>
      
          {/* subtitle */}
          <p
            className="font-maven"
            style={{
              color: "white",
              fontSize: "2em",
              marginTop: "-10px",
              marginBottom: "50px",
            }}
          >
            To Outline A Destination
          </p>
      
          <div
            style={{
              justifyItems: "center",
            }}
          >
            {/* already have account link */}
            <p className="font-maven" style={{ color: "white"}}>
              Don't have an account?{" "}
              <a
                href="/sign-up"
                style={{
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Sign Up.
              </a>
            </p>
      
            {/* form */}
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px",
                width: "80%",
                color: "white",
                marginTop: "10px"
              }}
              className="font-sunflower"
            >
              {/* email field */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "10px",
                  width: "300px",
                  height: "50px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <img
                  src={emailicon}
                  alt="Email Icon"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "auto 10px",
                    width: "30px",
                    height: "30px",
                  }}
                />
                <input
                  type="text"
                  id="email"
                  value = {email}
                  name="email"
                  placeholder="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    marginLeft: "12px",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    color: "white",
                    fontFamily: "'Sunflower', serif",
                    borderBottom: "2px solid rgba(255, 255, 255, 0.5)",
                    fontSize: "20px",
                  }}
                />
              </div>
      
              {/* password field */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "10px",
                  width: "300px",
                  height: "50px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <img
                  src={lock}
                  alt="Lock Icon"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "auto 10px",
                    width: "30px",
                    height: "30px",
                  }}
                />
                <input
                  type="password"
                  id="password"
                  value = {password}
                  name="password"
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    marginLeft: "12px",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    color: "white",
                    fontFamily: "'Sunflower', serif",
                    borderBottom: "2px solid rgba(255, 255, 255, 0.5)",
                    fontSize: "20px",
                  }}
                />
              </div>

              {/* login button */}
              <button
				type="submit"
                style={{
                  width: "300px",
                  height: "50px",
                  padding: "10px",
                  backgroundColor: "#728D5F",
                  fontFamily: "'Sunflower', serif",
                  borderRadius: "10px",
                  border: "none",
                  color: "white",
                  fontSize: "16px",
                }}
              >
                Log In
              </button>
              <p className="font-maven text-red-400 width-2 text-center">{error}</p>
            </form>
          </div>
        </div>
    );
}


export default SignInPage