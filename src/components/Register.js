import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/memberApi';
import './Register.css'; // 스타일 파일을 추가하세요

const Register = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    // 회원가입 요청
    const result = await registerUser({ email, nickname, password });

    if (result === 'success') {
      alert('회원가입 성공!');
      navigate('/login'); // 회원가입 성공 시 로그인 페이지로 이동
    } else {
      alert(`회원가입 실패: ${result}`);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>회원가입</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Nickname:</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">회원가입</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
