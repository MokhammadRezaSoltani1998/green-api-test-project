import React, { useState } from "react";
import type { GreenApiCredentials } from "../api/greenApi";

interface CredentialsFormProps {
  onSubmit: (data: GreenApiCredentials) => void;
}
const CredentialsForm = ({ onSubmit }: CredentialsFormProps) => {
  const [apiUrl, setApiUrl] = useState<string>("");
  const [idInstance, setIdInstance] = useState<string>("");
  const [apiTokenInstance, setApiTokenInstance] = useState<string>("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      apiUrl,
      idInstance,
      apiTokenInstance,
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>apiUrl</label>
        <input
          type="text"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          required
        />
      </div>
      <div>
        <label>idInstance</label>
        <input
          type="text"
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
          required
        />
      </div>
      <div>
        <label>apiTokenInstance</label>
        <input
          type="password"
          value={apiTokenInstance}
          onChange={(e) => setApiTokenInstance(e.target.value)}
          required
        />
      </div>
      <button type="submit">Continue</button>
    </form>
  );
};

export default CredentialsForm;
