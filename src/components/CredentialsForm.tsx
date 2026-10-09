
import { useState } from "react";
import type { GreenApiCredentials } from "../api/greenApi";

interface CredentialsFormProps {
  onSubmit: (data: GreenApiCredentials) => void;
}

const CredentialsForm = ({ onSubmit }: CredentialsFormProps) => {
  const [apiUrl, setApiUrl] = useState("");
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit({
      apiUrl: apiUrl.trim().replace(/\/+$/, ""),
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    });
  };

  return (
    <div className="auth-card">
      <h1>Подключение GREEN-API</h1>

      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="apiUrl">API URL</label>
          <input
            id="apiUrl"
            type="url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="idInstance">Instance ID</label>
          <input
            id="idInstance"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="apiTokenInstance">API Token</label>
          <input
            id="apiTokenInstance"
            type="password"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            required
          />
        </div>

        <button className="primary-button" type="submit">
          Продолжить
        </button>
      </form>
    </div>
  );
};

export default CredentialsForm;

