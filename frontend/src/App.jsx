import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import NewPasswordForm from './components/NewPasswordForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/reset-password/:token" element={<NewPasswordForm />} />
      </Routes>
    </Router>
  );
}

export default App;
