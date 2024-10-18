// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import About from './components/About';
import Teacher from './components/Teacher';
import MyResults from './components/MyResults'; 
import CompletedExams from './components/CompletedExams';
import UpcomingExams from './components/UpcomingExams';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/teacher" element={<Teacher />} />
                <Route path="/myresults" element={<MyResults />} />
                <Route path="/completed-exams" element={<CompletedExams />} />
                <Route path="/upcoming-exams" element={<UpcomingExams />} />
            </Routes>
        </Router>
    );
}

export default App;
