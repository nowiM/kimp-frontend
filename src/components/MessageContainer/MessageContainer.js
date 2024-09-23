import React, { useState, useEffect } from 'react';
import "./MessageContainer.css";
import { Container } from "@mui/system";

const MessageContainer = ({ messageList }) => {
  const [rgbUserName, setRgbUserName] = useState([]); // 사용자별 색상 정보를 저장하는 상태

  useEffect(() => {
    // 사용자별 고유 RGB 값을 설정하는 함수
    const updateUserColors = (messages) => {
      const userNameSet = new Set(messages.map(message => message.user.name));
      const updatedRgbUserName = [...rgbUserName];

      let hasUpdates = false; // 업데이트가 필요한지 확인

      userNameSet.forEach(user => {
        if (!updatedRgbUserName.find(u => u.user === user)) {
          updatedRgbUserName.push({
            user,
            color: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
          });
          hasUpdates = true; // 새로운 사용자가 추가된 경우 업데이트가 필요
        }
      });

      if (hasUpdates) {
        setRgbUserName(updatedRgbUserName);
      }
    };

    // 메시지 리스트가 업데이트될 때마다 사용자 색상을 설정
    updateUserColors(messageList);
  }, [messageList]); // rgbUserName을 의존성에서 제거

  // 특정 사용자 이름에 해당하는 RGB 색상을 반환하는 함수
  const getUserColor = (userName) => {
    const userColorObj = rgbUserName.find(u => u.user === userName);
    return userColorObj ? userColorObj.color : 'black';
  };

  return (
    <div className='messageCotainer'>
      {messageList.map((message, index) => (
        <Container key={`${message.user.id}-${index}`} className="message-container" style={{ padding: '0 15px' }}>
          <div className="my-message-container">
            <div className="user-name" style={{color: getUserColor(message.user.name)}}>
              {message.user.name}
            </div>
            <div className="my-message">{message.chat}</div>
          </div>
        </Container>
      ))}
    </div>
  );
};

export default MessageContainer;
