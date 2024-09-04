import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from '../src/components/MainPage';
import Login from '../src/components/Login';
import Register from '../src/components/Register';
import WaitRoom from './components/WaitRoom';
import Board from './components/Board';
import Header from './components/Header';
import Room from './components/Room'
import { AuthProvider } from './context/AuthContext';


const App = () => {
  return (
    <AuthProvider>
      <Router>
      <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wait-room" element={<WaitRoom />} />
          <Route path="/Board" element={<Board />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
