import React, { useState } from "react";
import type { GreenApiCredentials } from "../api/greenApi";
import { sendMessage } from "../api/greenApi";

interface ChatProps {
  credentials: GreenApiCredentials;
  chatId: string;
}

const Chat = ({ credentials, chatId }: ChatProps) => {
  const [message, setMessage] = useState<string>("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const response = await sendMessage(credentials, chatId, message);
      console.log(response);
      setMessage("");
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default Chat;
