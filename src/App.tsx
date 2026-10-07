import { useState } from "react";
import type { GreenApiCredentials } from "./api/greenApi";
import PhoneForm from "./components/PhoneForm";
import CredentialsForm from "./components/CredentialsForm";
import Chat from "./components/Chat";

function App() {
  const [credentials, setCredentials] = useState<GreenApiCredentials | null>(
    null,
  );
  const [chatId, setChatId] = useState<string | null>(null);

  return (
    <div>
      {credentials && chatId ? (
        <Chat credentials={credentials} chatId={chatId} />
      ) : credentials ? (
        <PhoneForm credentials={credentials} onChatSubmit={setChatId} />
      ) : (
        <CredentialsForm onSubmit={setCredentials} />
      )}
    </div>
  );
}

export default App;
