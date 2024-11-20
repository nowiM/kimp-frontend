import React from "react";
import { Input } from "@mui/base/Input";
import { Button } from "@mui/base/Button";

const InputField = ({ message, setMessage, sendMessage }) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // 엔터를 누르고 Shift 키가 눌리지 않은 경우 전송
      event.preventDefault(); // 기본 엔터 동작 방지
      sendMessage(event); // 메시지 전송
    }
  };

  return (
    <div className="input-area">
      <form onSubmit={sendMessage} className="input-container">
        <Input
          placeholder="채팅을 입력하세요."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          multiline={true}
          name={"input"}
          onKeyDown={handleKeyPress} // 키 프레스 이벤트 핸들러 추가
        />

        <Button
          disabled={message === ""}
          type="submit"
          className="send-button"
        >
          전송
        </Button>
      </form>
    </div>
  );
};

export default InputField;
