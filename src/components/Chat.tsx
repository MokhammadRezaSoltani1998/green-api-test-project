import { useEffect, useRef, useState } from "react";
import {
  sendMessage,
  receiveNotifications,
  deleteNotification,
  type GreenApiCredentials,
} from "../api/greenApi";

interface ChatProps {
  credentials: GreenApiCredentials;
  chatId: string;
  phone: string;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  direction: "incoming" | "outgoing";
  timestamp: number;
}

const Chat = ({ credentials, chatId, phone, onBack }: ChatProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = message.trim();
    if (!text || isSending) return;

    setIsSending(true);
    setError(null);

    try {
      const response = await sendMessage(credentials, chatId, text);

      setMessages((prev) => {
        if (prev.some((item) => item.id === response.idMessage)) {
          return prev;
        }

        return [
          ...prev,
          {
            id: response.idMessage,
            text,
            direction: "outgoing",
            timestamp: Date.now(),
          },
        ];
      });

      setMessage((current) => (current === message ? "" : current));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Не удалось отправить сообщение",
      );
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function pollNotifications() {
      while (!signal.aborted) {
        try {
          const notification = await receiveNotifications(
            credentials,
            20,
            signal,
          );

          if (signal.aborted) break;
          if (notification === null) continue;

          const { body, receiptId } = notification;
          const senderChatId = body.senderData?.chatId;

          const isCurrentChat =
            senderChatId === chatId || senderChatId === `${phone}@c.us`;

          if (
            body.typeWebhook === "incomingMessageReceived" &&
            body.messageData?.typeMessage === "textMessage" &&
            isCurrentChat
          ) {
            const id = body.idMessage;
            const text = body.messageData.textMessageData?.textMessage;

            if (id && text !== undefined) {
              const incomingMessage: ChatMessage = {
                id,
                text,
                direction: "incoming",
                timestamp: body.timestamp ? body.timestamp * 1000 : Date.now(),
              };

              setMessages((prev) => {
                if (prev.some((item) => item.id === id)) {
                  return prev;
                }

                return [...prev, incomingMessage];
              });
            }
          }

          const deleted = await deleteNotification(
            credentials,
            receiptId,
            signal,
          );

          if (!deleted) {
            throw new Error("Не удалось удалить уведомление");
          }
        } catch (error) {
          if (signal.aborted) break;

          setError(
            error instanceof Error
              ? error.message
              : "Ошибка получения сообщений",
          );

          break;
        }
      }
    }

    void pollNotifications();

    return () => {
      controller.abort();
    };
  }, [credentials, chatId, phone]);

  return (
    <section className="conversation">
      <header className="conversation-header">
        <button
          className="back-button"
          type="button"
          onClick={onBack}
          aria-label="Назад"
        >
          ←
        </button>

        <span className="avatar">👤</span>

        <div className="conversation-contact">
          <strong>+{phone}</strong>
          <span>WhatsApp</span>
        </div>
      </header>

      <div className="conversation-body">
        <div className="messages-container">
          {messages.length === 0 ? (
            <p className="empty-conversation">Сообщений пока нет</p>
          ) : (
            messages.map((item) => (
              <div
                key={item.id}
                className={`message-row message-row--${item.direction}`}
              >
                <div
                  className={`message-bubble message-bubble--${item.direction}`}
                >
                  <div className="message-text">{item.text}</div>

                  <div className="message-meta">
                    {new Date(item.timestamp).toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="conversation-footer">
        {error && (
          <p className="chat-error" role="alert">
            {error}
          </p>
        )}

        <form className="message-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Написать сообщение..."
            maxLength={20000}
            aria-label="Текст сообщения"
          />

          <button
            className="send-button"
            type="submit"
            disabled={isSending || !message.trim()}
            aria-label="Отправить сообщение"
          >
            {isSending ? "..." : "➤"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Chat;
