import React, { useState } from 'react';
import './Teacher.css';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Teacher() {
    const [section, setSection] = useState('');
    const [sectionCode, setSectionCode] = useState('');
    const [questions, setQuestions] = useState([{ questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 1, image: '' }]);
    const [timer, setTimer] = useState('');
    const [inputText, setInputText] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    // Updated parseAikenFormat function
    const parseAikenFormat = (text) => {
        const questions = [];
        const lines = text.split('\n');
        let currentQuestion = null;

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('Q:')) {
                if (currentQuestion) questions.push(currentQuestion);
                currentQuestion = {
                    questionText: trimmedLine.substring(2).trim(),
                    options: ['', '', '', ''],
                    correctAnswer: '',
                    marks: 1,
                    image: ''
                };
            } else if (trimmedLine.match(/^[A-D]\./)) {
                const optionIndex = trimmedLine.charCodeAt(0) - 'A'.charCodeAt(0);
                if (currentQuestion) {
                    currentQuestion.options[optionIndex] = trimmedLine.substring(2).trim();
                    // Set correct answer if the line starts with an asterisk (*)
                    if (trimmedLine.startsWith('*')) {
                        currentQuestion.correctAnswer = currentQuestion.options[optionIndex];
                    }
                }
            }
        });

        // Push the last question if it exists
        if (currentQuestion) questions.push(currentQuestion);

        // Set correct answer based on options if not already set
        questions.forEach((question) => {
            if (!question.correctAnswer && question.options[0]) {
                question.correctAnswer = question.options[0]; // Default to first option if no correct answer was marked
            }
        });

        return questions;
    };

    const handleTextChange = (e) => {
        setInputText(e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setInputText(event.target.result);
            };
            reader.readAsText(file);
        }
    };

    const handleParseQuestions = () => {
        const parsedQuestions = parseAikenFormat(inputText);
        setQuestions(parsedQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const quizData = {
            section,
            sectionCode,
            questions,
            timer,
        };

        try {
            // Add a new document with a generated ID in Firestore
            await addDoc(collection(db, 'quizzes'), quizData);
            alert('Quiz added successfully!');
            resetForm();
            navigate('/home'); // Navigate to home page after successful submission
        } catch (error) {
            console.error('Error adding quiz: ', error);
            alert('Failed to add quiz. Please try again.');
        }
    };

    const resetForm = () => {
        setSection('');
        setSectionCode('');
        setTimer('');
        setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 1, image: '' }]);
        setInputText('');
    };

    const handleQuestionChange = (qIndex, e) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].questionText = e.target.value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, optionIndex, e) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[optionIndex] = e.target.value;
        setQuestions(newQuestions);
    };

    const handleMarksChange = (qIndex, e) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].marks = parseInt(e.target.value, 10);
        setQuestions(newQuestions);
    };

    const handleImageChange = (qIndex, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newQuestions = [...questions];
                newQuestions[qIndex].image = event.target.result;
                setQuestions(newQuestions);
            };
            reader.readAsDataURL(file);
        }
    };

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 1, image: '' }]);
    };
    return (
        <div className="teacher-container">
            <h2 className="teacher-title">Teacher's Quiz Portal</h2>
            <p className="teacher-description">
                Here you can add quiz details, including questions, options, and answers for your students.
            </p>

            <form className="quiz-form" onSubmit={handleSubmit}>
                <label className="form-label" htmlFor="section">Section</label>
                <input
                    type="text"
                    id="section"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="form-input"
                    placeholder="Enter Section"
                    required
                />

                <label className="form-label" htmlFor="sectionCode">Section Code</label>
                <input
                    type="text"
                    id="sectionCode"
                    value={sectionCode}
                    onChange={(e) => setSectionCode(e.target.value)}
                    className="form-input"
                    placeholder="Enter Section Code"
                    required
                />

                <label className="form-label" htmlFor="timer">Timer (in minutes)</label>
                <input
                    type="number"
                    id="timer"
                    value={timer}
                    onChange={(e) => setTimer(e.target.value)}
                    className="form-input"
                    placeholder="Enter Timer Duration"
                    required
                />

                <label className="form-label" htmlFor="fileInput">Upload Aiken Format Questions File</label>
                <input
                    type="file"
                    id="fileInput"
                    accept=".txt"
                    onChange={handleFileChange}
                    className="form-input"
                />

                <label className="form-label" htmlFor="questionsInput">Or Enter Aiken Format Questions</label>
                <textarea
                    id="questionsInput"
                    value={inputText}
                    onChange={handleTextChange}
                    className="form-input"
                    placeholder="Enter Questions in Aiken Format"
                    rows="10"
                    required
                />

                <button type="button" onClick={handleParseQuestions} className="parse-button">
                    Parse Questions
                </button>

                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="question-block">
                        <label className="form-label">Question {qIndex + 1}</label>
                        <input
                            type="text"
                            value={q.questionText}
                            onChange={(e) => handleQuestionChange(qIndex, e)}
                            className="form-input"
                            placeholder="Enter Question"
                            required
                        />

                        <label className="form-label">Marks</label>
                        <input
                            type="number"
                            value={q.marks}
                            onChange={(e) => handleMarksChange(qIndex, e)}
                            className="form-input"
                            placeholder="Enter Marks"
                            required
                        />

                        <label className="form-label">Upload Image (optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(qIndex, e)}
                            className="form-input"
                        />

                        {q.image && <img src={q.image} alt={`Question ${qIndex + 1}`} className="question-image" />}

                        {q.options.map((option, optionIndex) => (
                            <div key={optionIndex}>
                                <label className="form-label">Option {optionIndex + 1}</label>
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(qIndex, optionIndex, e)}
                                    className="form-input"
                                    placeholder="Enter Option"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                ))}

                <button type="button" onClick={addQuestion} className="add-question-button">
                    Add Question
                </button>

                <button type="submit" className="submit-button">Submit Quiz</button>
            </form>
        </div>
    );
}

export default Teacher;
