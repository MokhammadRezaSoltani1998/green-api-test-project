import { useState } from "react";
import { checkWhatsapp, type GreenApiCredentials } from "../api/greenApi";
interface PhoneFormProps {
  credentials: GreenApiCredentials;
  onChatSubmit: (chatId: string) => void;
}
const PhoneForm = ({ credentials, onChatSubmit }: PhoneFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const formattedPhone = parseInt(phoneNumber.replace(/\D/g, ""), 10);
      const response = await checkWhatsapp(credentials, formattedPhone);
      if (response.existsWhatsapp && response.chatId) {
        onChatSubmit(response.chatId);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Произошла неизвестная ошибка:", error);
      }
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Phone Number</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>
      <button type="submit">Создать чат</button>
    </form>
  );
};

export default PhoneForm;
