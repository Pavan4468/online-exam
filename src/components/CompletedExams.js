// src/components/CompletedExams.js

import React from 'react';
import './CompletedExams.css'; // Import the CSS file

const CompletedExams = () => {
    return (
        <div className="exams-container">
            <h1>Completed Exams</h1>
            <ul className="exams-list">
                <li>Math Exam - 01/01/2024</li>
                <li>Science Exam - 02/01/2024</li>
                <li>History Exam - 03/01/2024</li>
                <li>English Exam - 04/01/2024</li>
                <li>Physics Exam - 05/01/2024</li>
                <li>Chemistry Exam - 06/01/2024</li>
                <li>Geography Exam - 07/01/2024</li>
                <li>Biology Exam - 08/01/2024</li>
            </ul>
        </div>
    );
};

export default CompletedExams;
