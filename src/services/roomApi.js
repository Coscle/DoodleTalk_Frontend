// src/services/roomApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // 백엔드 API 주소

// 방 생성 요청
export const createRoom = async (roomData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/rooms`, roomData);
        return response.data;
    } catch (error) {
        console.error('방 생성 요청 오류:', error.response || error);
        return error.response ? error.response.data : '방 생성 실패';
    }
};

// 방 목록 조회 요청
export const fetchRooms = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/rooms`);
        return response.data;
    } catch (error) {
        console.error('방 목록 조회 오류:', error.response || error);
        return error.response ? error.response.data : '방 목록 조회 실패';
    }
};

// 방 제목을 가져오는 함수
export const fetchRoomInfo = async (roomId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rooms/${roomId}`);
      return response.data; // 서버에서 방 제목을 포함한 응답이 있다고 가정
    } catch (error) {
      console.error('방 제목을 가져오는 중 오류 발생:', error);
      throw error;
    }
  };

// 방 입장 요청
export const joinRoom = async (roomId, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/rooms/${roomId}/${password}/join`);
        return response.data;
    } catch (error) {
        console.error('방 입장 요청 오류:', error.response || error);
        return error.response ? error.response.data : '방 입장 실패';
    }
};

export const deleteRoom = async (roomId, password) => {
    try{
        const response = await axios.delete(`http://localhost:8080/api/rooms/${roomId}/${password}`);
        return response.data;
    } catch (error) {
        console.error('방 폭파 오류', error.response || error);
        return error.response ? error.response.data : "방 폭파 실패";
    }
  };

