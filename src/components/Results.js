// Results.js
import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Results.css';

const Results = () => {
    const [results, setResults] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchResults = async () => {
            const resultsCollection = collection(db, 'results');
            const resultsSnapshot = await getDocs(resultsCollection);
            const resultsData = resultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setResults(resultsData);
        };

        const checkUserRole = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const role = userDoc.data().role;
                    setIsAdmin(role === 'admin');
                    if (role !== 'admin') {
                        navigate('/'); // Redirect to home if not admin
                    }
                }
            } else {
                navigate('/login'); // Redirect to login if not authenticated
            }
        };

        fetchResults();
        checkUserRole();
    }, [navigate]); // Add navigate to the dependency array

    return (
        <div className="results-container">
            <h2>Student Results</h2>
            {results.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quiz ID</th>
                            <th>Score</th>
                            {isAdmin && <th>Time Taken</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(result => (
                            <tr key={result.id}>
                                <td>{result.name}</td>
                                <td>{result.quizId}</td>
                                <td>{result.score}</td>
                                {isAdmin && <td>{result.timeTaken} seconds</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No results available.</p>
            )}
        </div>
    );
};

export default Results;
