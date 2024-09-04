import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRooms, createRoom, joinRoom } from '../services/roomApi';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './WaitRoom.css';

const WaitRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [createRoomModalVisible, setCreateRoomModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const roomsPerPage = 6; // 페이지당 방 목록 개수
  const navigate = useNavigate();

  useEffect(() => {
    const getRooms = async () => {
      const data = await fetchRooms();
      setRooms(data);
    };

    getRooms();

    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/rooms', (message) => {
        setRooms(JSON.parse(message.body));
      });
    });

    return () => stompClient.disconnect();
  
  }, []);

  const handleCreateRoom = async () => {
    if (roomName && password) {
      const newRoom = await createRoom({ name: roomName, password });
      if (newRoom) {
        setRooms([...rooms, newRoom]);
        setCreateRoomModalVisible(false);
        setRoomName('');
        setPassword('');
      }
    } else {
      alert('방 제목과 비밀번호를 입력하세요.');
    }
  };

  const handleJoinRoom = (roomId) => {
    setCurrentRoomId(roomId);
    setModalVisible(true);
  };

  const handlePasswordSubmit = async () => {
    const inputPassword = document.getElementById('modal-password').value;
    if (inputPassword) {
      try {
        const result = await joinRoom(currentRoomId, inputPassword);
        if (result == "success") {
          navigate(`/room/${currentRoomId}`);
          setModalVisible(false);
        } else {
          alert('비밀번호가 틀렸습니다.');
        }
      } catch (e) {
        alert('오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  // 페이지네이션 로직
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="wait-room-container">
      <div className="room-list">
      <h1>방 목록</h1>
        {rooms.length === 0 ? (
          <p>목록에 생성된 방이 없습니다.</p>
        ) : (
          <>
            <ul>
              {currentRooms.map(room => (
                <li key={room.id}>
                  <span className="room-name">{room.name}</span>
                  <button onClick={() => handleJoinRoom(room.id)}>입장</button>
                </li>
              ))}
            </ul>
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <span
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  {index + 1}
                </span>
              ))}
            </div>
          </>
        )}
        <button className="create-room-button" onClick={() => setCreateRoomModalVisible(true)}>방 생성</button>
      </div>

      <div className="room-image">
        <img src="/doodletalk.jpeg" alt="GuessTheDoodle" className="main-image2" />
      </div>

      {modalVisible && (
        <div className="password-modal">
          <div className="modal-content">
            <h2>비밀번호 입력</h2>
            <input
              id="modal-password"
              type="password"
              placeholder="비밀번호를 입력하세요"
            />
            <button onClick={handlePasswordSubmit}>확인</button>
            <button onClick={() => setModalVisible(false)}>취소</button>
          </div>
        </div>
      )}

      {createRoomModalVisible && (
        <div className="create-room-modal">
          <div className="modal-content">
            <h2>방 생성</h2>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="방 제목"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
            />
            <button onClick={handleCreateRoom}>생성</button>
            <button onClick={() => setCreateRoomModalVisible(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitRoom;
