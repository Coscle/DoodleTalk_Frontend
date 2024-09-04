import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // AuthContext를 사용합니다.
import './MainPage.css'; // 스타일 파일을 추가하세요

const MainPage = () => {
  const { user, logout } = useAuth(); // 현재 사용자 정보와 로그아웃 함수 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  const handleLogout = () => {
    logout(); // 로그아웃 처리
    navigate('/'); // 로그아웃 후 메인 페이지로 리디렉션
  };

  return (
    <div className="main-page">
      <img src="/doodletalk.jpeg" alt="GuessTheDoodle" className="main-image" />
      <h1>Welcome to DoodleTalk!</h1>
      <div className="button-container">
        {!user ? (
          <>
            <Link to="/login">
              <button className="main-button">로그인</button>
            </Link>
            <Link to="/register">
              <button className="main-button">회원가입</button>
            </Link>
          </>
        ) : (
          <>
            <button className="main-button" onClick={handleLogout}>로그아웃</button>
            <Link to="/wait-room">
              <button className="main-button">대기실</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MainPage;
