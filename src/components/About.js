import React from 'react';
import './About.css'; // Import styles specific to the About page

const About = () => {
    return (
        <div className="about-container">
            <h1>About This Application</h1>
            <p>
                Welcome to our quiz application! This platform allows you to test your knowledge
                on various subjects by answering multiple-choice questions. Whether you're looking
                to challenge yourself or learn something new, our quizzes are a great way to
                enhance your knowledge.
            </p>
            <p>
                Each section of the quiz focuses on a different topic, so you can choose a section
                that interests you and track your performance through your results. Good luck and
                enjoy learning!
            </p>
        </div>
    );
};

export default About;
