export type GreenApiCredentials = {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
};

export type CheckAccountResponse = {
  existsWhatsapp: boolean;
  chatId?: string;
  fromCache: boolean;
};
export type SendMessageResponse = {
  idMessage: string;
};
export async function checkWhatsapp(
  credentials: GreenApiCredentials,
  phone: number,
): Promise<CheckAccountResponse> {
  const url = `${credentials.apiUrl}/waInstance${credentials.idInstance}/checkWhatsapp/${credentials.apiTokenInstance}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phoneNumber: phone,
      force: false,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(`API error: ${response.status}`);
  }
  const data = (await response.json()) as CheckAccountResponse;
  return data;
}

export async function sendMessage(
  credentials: GreenApiCredentials,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> {
  const url = `${credentials.apiUrl}/waInstance${credentials.idInstance}/sendMessage/${credentials.apiTokenInstance}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatId,
      message,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(`API Sending message error: ${response.status}`);
  }
  const data = (await response.json()) as SendMessageResponse;

  return data;
}

// export async function receiveNotifications(credentials: GreenApiCredentials) {
//   const url = `${credentials.apiUrl}/waInstance${credentials.idInstance}/receiveNotification/${credentials.apiTokenInstance}`;
//   const response = await fetch(url);
// }
