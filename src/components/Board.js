import React, { useEffect, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Board.css'; // 스타일 파일을 추가하세요.

const Board = () => {
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000'); // 선 색깔 기본값
  const [lineWidth, setLineWidth] = useState(5); // 선 굵기 기본값
  const [tool, setTool] = useState('pen'); // 'pen' 또는 'eraser'
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    // STOMP 클라이언트 설정
    const socket = new SockJS('http://localhost:8080/ws/drawings'); // WebSocket 서버 연결
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {},
      onConnect: () => {
        client.subscribe('/topic/drawings', (message) => {
          // 서버로부터 실시간 그림 데이터를 받아서 업데이트
          const newLines = JSON.parse(message.body);
          setLines(newLines);
        });
      }
    });

    client.activate(); // STOMP 서버와 연결

    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate(); // 컴포넌트가 언마운트될 때 STOMP 서버와 연결 해제
      }
    };
  }, []);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    const newLine = { points: [pos.x, pos.y], stroke: color, strokeWidth: lineWidth, tool };

    setLines([...lines, newLine]);
    if (stompClient) {
      stompClient.publish({
        destination: '/app/drawings',
        body: JSON.stringify([...lines, newLine])
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLineIndex = lines.length - 1;
    const updatedLines = [...lines];
    const lastLine = updatedLines[lastLineIndex];
    
    if (lastLine) {
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      updatedLines[lastLineIndex] = lastLine;
      setLines(updatedLines);

      if (stompClient) {
        stompClient.publish({
          destination: '/app/drawings',
          body: JSON.stringify(updatedLines)
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleLineWidthChange = (e) => {
    setLineWidth(parseInt(e.target.value, 10));
  };

  const clearCanvas = () => {
    setLines([]);
    if (stompClient) {
      stompClient.publish({
        destination: '/app/drawings',
        body: JSON.stringify([])
      });
    }
  };

  const handleToolChange = (tool) => {
    setTool(tool);
  };

  return (
    <div className="drawing-app">
      <div className="controls">
        <div className="color-picker">
          <label>색</label>
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            disabled={tool === 'eraser'}
          />
        </div>
        <div className="line-width-picker">
          <label>펜굵기</label>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={handleLineWidthChange}
          />
          <span>{lineWidth}</span>
        </div>
        <button className="pen-button"onClick={() => handleToolChange('pen')}>펜</button>
        <button className="clear-button" onClick={clearCanvas}>초기화 </button>
      </div>
      <Stage
        width={1500}
        height={900}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        style={{ border: '1px solid black' }}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.tool === 'eraser' ? 'transparent' : line.stroke}
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Board;
