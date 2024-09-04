// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // 백엔드 API 주소

// 회원가입 요청
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.error('회원가입 요청 오류:', error.response || error);
        return error.response ? error.response.data : '회원가입 실패';
    }
};

// 로그인 요청
export const loginUser = async (loginData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, loginData);
        return response.data;  // JWT 토큰 반환
    } catch (error) {
        console.error('로그인 요청 오류:', error.response || error);
        return error.response ? error.response.data : '로그인 실패';
    }
};
