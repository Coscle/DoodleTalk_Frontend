import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Board from './Board';
import { fetchRoomInfo, deleteRoom } from '../services/roomApi'; // deleteRoom 함수 임포트
import './Room.css'; // 스타일 파일 임포트

const Room = () => {
  const { roomId } = useParams();
  const [roomTitle, setRoomTitle] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const roomInfo = await fetchRoomInfo(roomId);
        setRoomTitle(roomInfo.name);
      } catch (error) {
        console.error('방 제목을 가져오는 중 오류 발생:', error);
      }
    };

    fetchTitle();
  }, [roomId]);

  const handleDeleteRoom = async () => {
    if (password) {
      try {
        const result = await deleteRoom(roomId, password);
        if (result === "success") {
          // 방 삭제 성공 시, 적절한 후속 작업(예: 이동)
          alert('방이 삭제되었습니다.');
          // 예를 들어 홈으로 리다이렉트할 수 있습니다.
          window.location.href = '/wait-room'; // 홈 페이지로 이동
        } else {
          alert('비밀번호가 틀렸습니다.');
        }
      } catch (e) {
        alert('오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  return (
    <div className="room-container">
      <div className="room-header">
        <h1>{roomTitle}</h1>
        <button className="delete-room-button" onClick={() => setModalVisible(true)}>방 폭파하기</button>
      </div>
      <Board />
      
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>방 삭제</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
            <button onClick={handleDeleteRoom}>폭파</button>
            <button onClick={() => setModalVisible(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;
