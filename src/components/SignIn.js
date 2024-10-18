import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebaseConfig'; // Import Firebase authentication
import './SignIn.css';

function SignIn() {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home'); // Navigate to Home after successful sign in
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="form-container">
            <div className="form-box">
                <h2 className="title">Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" required />
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error if any */}

                    <button type="submit" className="btn">Sign In</button>
                </form>
                <p className="text">
                    Don't have an account? <Link to="/signup" className="link">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default SignIn;
