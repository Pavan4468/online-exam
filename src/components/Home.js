import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from './firebaseConfig'; // Adjust the import path according to your project structure
import { collection, getDocs, getDoc, doc, query, where, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import magicImage from '../assets/magic.jpg';
import './Home.css'; 

const Home = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [quizEnded, setQuizEnded] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [userSection, setUserSection] = useState("");
    const [userRole, setUserRole] = useState(""); 
    const [resultsVisible, setResultsVisible] = useState(false);
    const [finalScore, setFinalScore] = useState(0); // State to store final score
    const [notification, setNotification] = useState("");
    const timerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (timeLeft > 0) {
            timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && currentQuiz) {
            handleSubmit(); 
        }
    }, [timeLeft, currentQuiz]);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid)); 
                setUserSection(userDoc.data().section);
                setUserRole(userDoc.data().role); 
            }
        };

        fetchUserData();
    }, []); 
   
    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!userSection) return;

            const quizCollection = collection(db, 'quizzes');
            const sectionQuery = query(quizCollection, where('section', '==', userSection));
            const quizSnapshot = await getDocs(sectionQuery); 
            const quizList = quizSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setQuizzes(quizList);
        };

        if (userSection) {
            fetchQuizzes();
        }
    }, [userSection]); 

    const handleQuizSelect = (quiz) => {
        setCurrentQuiz(quiz);
        setCurrentQuestionIndex(0);
        setUserAnswers(new Array(quiz.questions.length).fill(null));
        setTimeLeft(quiz.timer * 60);
    };

    const handleAnswerSelect = (answer) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentQuestionIndex] = answer;
        setUserAnswers(updatedAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < currentQuiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Submit quiz
    const handleSubmit = async () => {
        if (!currentQuiz) {
            console.error("No current quiz selected");
            return; // Exit if there's no current quiz
        }

        setQuizEnded(true);
        clearTimeout(timerRef.current);

        // Calculate final score
        const score = userAnswers.reduce((acc, answer, index) => {
            if (answer === currentQuiz.questions[index].correctAnswer) {
                return acc + 1; // Increment score for correct answers
            }
            return acc;
        }, 0);
        
        setFinalScore(score); // Set final score

        // Store results in Firestore
        const user = auth.currentUser;
        const resultsRef = doc(db, 'results', user.uid); 
        await setDoc(resultsRef, {
            quizId: currentQuiz.id,
            section: currentQuiz.section,
            score: score,
            timeTaken: currentQuiz.timer - Math.floor(timeLeft / 60), // Time taken in minutes
            submittedAt: new Date(),
        });

        setResultsVisible(true);
        setNotification("Your answers have been submitted.");
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    useEffect(() => {
        const preventCopying = (e) => {
            if (e.ctrlKey && (e.key === 'c' || e.key === 'x' || e.key === 'v')) {
                e.preventDefault();
            }
        };

        const preventTabSwitching = () => {
            setNotification('No switching tabs! Your quiz will be auto-submitted.');
            handleSubmit();
        };

        const preventWindowResize = () => {
            setNotification('Window resizing detected! The quiz will be auto-submitted.');
            handleSubmit();
        };

        window.addEventListener('keydown', preventCopying);
        window.addEventListener('blur', preventTabSwitching);
        window.addEventListener('resize', preventWindowResize);

        return () => {
            window.removeEventListener('keydown', preventCopying);
            window.removeEventListener('blur', preventTabSwitching);
            window.removeEventListener('resize', preventWindowResize);
        };
    }, []);

    return (
        <div className="home-container">
            <div className="header">
                <img src={magicImage} alt="College Logo" className="college-logo" />
                <h2>Test Hub</h2>
                <nav>
                    {userRole === 'teacher' && <Link to="/teacher">Teachers</Link>}
                  
                    <Link to="/about">About</Link>
                </nav>
            </div>
            <div className="content">
                <h2 className="home-title">Quiz Section</h2>
                {quizzes.length > 0 ? (
                    quizzes.map((quiz) => (
                        <div key={quiz.id} className="quiz-container" onClick={() => handleQuizSelect(quiz)}>
                            <h3 className="quiz-title">{quiz.section} ({quiz.sectionCode})</h3>
                            <h4 className="quiz-timer">Timer: {quiz.timer} minutes</h4>
                        </div>
                    ))
                ) : (
                    <p className="no-quizzes-message">No quizzes available.</p>
                )}
                {currentQuiz && !quizEnded && (
                    <div className="questions-container">
                        <h3>{currentQuiz.section} - Question {currentQuestionIndex + 1}</h3>
                        <div className="question-block">
                            <p>{currentQuiz.questions[currentQuestionIndex].questionText}</p>
                            {currentQuiz.questions[currentQuestionIndex].options.map((option, optIndex) => (
                                <button
                                    key={optIndex}
                                    onClick={() => handleAnswerSelect(option)}
                                    className={`option-button ${userAnswers[currentQuestionIndex] === option ? 'selected' : ''}`}>
                                    {option}
                                </button>
                            ))}
                        </div>
                        <div className="navigation-buttons">
                            <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
                            <button onClick={handleNextQuestion} disabled={currentQuestionIndex === currentQuiz.questions.length - 1}>Next</button>
                        </div>
                        <div className="timer-container">
                            <h4>Time left: {formatTime(timeLeft)}</h4>
                        </div>
                        {currentQuestionIndex === currentQuiz.questions.length - 1 && (
                            <button onClick={handleSubmit} className="submit-button">Submit</button>
                        )}
                    </div>
                )}
                {quizEnded && (
                    <div className="quiz-ended">
                        <h2>Quiz Ended</h2>
                        <p>Your answers have been submitted.</p>
                    </div>
                )}
                {resultsVisible && (
                    <div className="results-container">
                        <h2>Your Results</h2>
                        <p>Quiz ID: {currentQuiz.id}</p>
                        <h4>Section: {currentQuiz.section}</h4>
                        <h4>Final Score: {finalScore} out of {currentQuiz.questions.length}</h4>
                        <Link to="/">Return to Home</Link>
                    </div>
                )}
                {notification && (
                    <div className="notification">
                        <p>{notification}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
