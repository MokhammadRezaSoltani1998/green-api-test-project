
import { useState } from "react";
import { checkWhatsapp, type GreenApiCredentials } from "../api/greenApi";

interface PhoneFormProps {
  credentials: GreenApiCredentials;
  onChatSubmit: (chat: { chatId: string; phone: string }) => void;
}

const PhoneForm = ({ credentials, onChatSubmit }: PhoneFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const phone = phoneNumber.replace(/\D/g, "");

    if (!/^[1-9]\d{6,14}$/.test(phone)) {
      setError("Введите номер в международном формате");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await checkWhatsapp(credentials, Number(phone));

      if (!response.existsWhatsapp || !response.chatId) {
        setError("Номер не найден в WhatsApp");
        return;
      }

      onChatSubmit({
        chatId: response.chatId,
        phone,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Не удалось проверить номер",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="new-chat-card">
      <h2>Новый чат</h2>

      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="phone">Номер телефона</label>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="79876543210"
            required
          />
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button
          className="primary-button"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Проверка..." : "Создать чат"}
        </button>
      </form>
    </div>
  );
};

export default PhoneForm;

