import React, { useEffect, useState } from 'react';
import { auth, db } from './firebaseConfig'; // Adjust the import path according to your project structure
import { doc, getDoc } from 'firebase/firestore';
import './myresults.css'; 

const MyResults = () => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            const user = auth.currentUser;
            if (user) {
                const resultsRef = doc(db, 'results', user.uid);
                const resultsDoc = await getDoc(resultsRef);
                if (resultsDoc.exists()) {
                    setResults(resultsDoc.data().results || []); // Ensure to access the results field correctly
                } else {
                    setResults([]); // Set to empty if no results
                }
            }
        };

        fetchResults();
    }, []);

    return (
        <div className="my-results-container">
            <h2>My Results</h2>
            {results.length > 0 ? (
                <ul className="results-list">
                    {results.map((result, index) => (
                        <li key={index} className="result-item">
                            <h4>Quiz ID: {result.quizId}</h4>
                            <p>Section: {result.section}</p>
                            <p>Score: {result.score}</p>
                            <p>Time Taken: {result.timeTaken} minutes</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results available.</p>
            )}
        </div>
    );
};

export default MyResults;
