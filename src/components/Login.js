import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/memberApi'; // API 요청 함수를 사용하는 것이 좋습니다.
import { useAuth } from '../context/AuthContext';
import './Login.css'; // 스타일 파일을 추가하세요

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await loginUser({ email, password });

      if (response && typeof response === 'string') {
        // 로그인 성공 시 JWT 토큰을 localStorage에 저장
        login(response);
        navigate('/wait-room'); // 로그인 성공 시 이동
      } else {
        // 서버에서 보내온 에러 메시지
        alert('로그인 실패. 이메일과 비밀번호를 확인하세요.');
      }

    } catch (error) {
      console.error('로그인 요청 오류:', error);
      alert('로그인 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>로그인</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>이메일:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>비밀번호:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
