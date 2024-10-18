import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from './firebaseConfig'; // Import Firebase authentication and Firestore
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions
import './SignUp.css';

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const section = e.target.section.value;
        const isTeacher = email.includes('@teacher');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user details including section and role (teacher or student) in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                username,
                email,
                section,
                role: isTeacher ? 'teacher' : 'student',
            });

            navigate('/home'); // Navigate to Home after successful sign-up
        } catch (err) {
            console.error("Error signing up:", err);
            setError(err.message);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="form-container">
            <div className="form-box">
                <h2 className="title">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            required
                        />
                        <i
                            className={showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'}
                            onClick={togglePasswordVisibility}
                        ></i>
                    </div>
                    <div className="input-group">
                        <label htmlFor="section">Section</label>
                        <input type="text" id="section" name="section" required placeholder="e.g., 5CIT01" />
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button type="submit" className="btn">Sign Up</button>
                </form>
                <p className="text">
                    Already have an account? <Link to="/" className="link">Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp;
