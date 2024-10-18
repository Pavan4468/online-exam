// src/components/UpcomingExams.js

import React from 'react';
import './UpcomingExams.css'; // Import the CSS file

const UpcomingExams = () => {
    return (
        <div className="exams-container">
            <h1>Upcoming Exams</h1>
            <ul className="exams-list">
                <li>English Exam - 10/10/2024</li>
                <li>Physics Exam - 11/10/2024</li>
                <li>Chemistry Exam - 12/10/2024</li>
                <li>Math Exam - 13/10/2024</li>
                <li>History Exam - 14/10/2024</li>
                <li>Biology Exam - 15/10/2024</li>
                <li>Geography Exam - 16/10/2024</li>
                <li>Computer Science Exam - 17/10/2024</li>
            </ul>
        </div>
    );
};

export default UpcomingExams;
