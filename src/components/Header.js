import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css'; // 스타일 파일을 추가하세요

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // 로그아웃 처리
    navigate('/'); // 로그아웃 후 메인 페이지로 리디렉션
  };

  return (
    <header>
      <Link to="/" className="header-title">
        DoodleTalk
      </Link>
      <nav>
        {user ? (
          <div className="user-info">
            <span className="user-nickname">{user.nickname}</span>님 접속중 {/* 사용자 닉네임 표시 */}
            <button className="logout-button" onClick={handleLogout}>로그아웃</button>
          </div>
        ) : (
          <button className="login-button" onClick={() => navigate('/login')}>로그인</button>
        )}
      </nav>
    </header>
  );
};

export default Header;
