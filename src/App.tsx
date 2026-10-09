import { useState } from "react";
import type { GreenApiCredentials } from "./api/greenApi";
import CredentialsForm from "./components/CredentialsForm";
import PhoneForm from "./components/PhoneForm";
import Chat from "./components/Chat";

interface SelectedChat {
  chatId: string;
  phone: string;
}

function App() {
  const [credentials, setCredentials] = useState<GreenApiCredentials | null>(
    null,
  );

  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);

  const handleChangeCredentials = () => {
    setSelectedChat(null);
    setCredentials(null);
  };

  if (!credentials) {
    return (
      <div className="auth-layout">
        <CredentialsForm onSubmit={setCredentials} />
      </div>
    );
  }

  return (
    <div className="messenger">
      <aside className="sidebar">
        <header className="sidebar-header">
          <div className="brand">
            <span className="brand-icon">M</span>
            <span>Messenger</span>
          </div>

          <div className="sidebar-actions">
            <button
              className="icon-button icon-button--settings"
              type="button"
              onClick={handleChangeCredentials}
              aria-label="Изменить подключение"
            >
              ⚙
            </button>

            <button
              className="icon-button"
              type="button"
              onClick={() => setSelectedChat(null)}
              aria-label="Новый чат"
            >
              +
            </button>
          </div>
        </header>

        <h2 className="sidebar-section-title">Чаты</h2>

        {selectedChat ? (
          <div className="chat-list-item active">
            <span className="avatar">👤</span>

            <div className="chat-list-details">
              <strong>+{selectedChat.phone}</strong>
              <small>WhatsApp</small>
            </div>
          </div>
        ) : (
          <p className="sidebar-empty">Чатов пока нет</p>
        )}
      </aside>

      <main className="main-panel">
        {selectedChat ? (
          <Chat
            key={selectedChat.chatId}
            credentials={credentials}
            chatId={selectedChat.chatId}
            phone={selectedChat.phone}
            onBack={() => setSelectedChat(null)}
          />
        ) : (
          <div className="new-chat-screen">
            <PhoneForm
              credentials={credentials}
              onChatSubmit={setSelectedChat}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
