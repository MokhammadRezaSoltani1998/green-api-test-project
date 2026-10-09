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

export interface ReceiveNotificationResponse {
  receiptId: number;
  body: {
    typeWebhook: string;
    instanceData?: {
      idInstance: number;
    };
    timestamp?: number;
    idMessage?: string;
    senderData?: {
      chatId: string;
      senderName?: string;
    };
    messageData?: {
      typeMessage: string;
      textMessageData?: {
        textMessage: string;
      };
    };
  };
}

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
    throw new Error(`Ошибка проверки WhatsApp: ${response.status}`);
  }

  return (await response.json()) as CheckAccountResponse;
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
    throw new Error(`Ошибка отправки сообщения: ${response.status}`);
  }

  return (await response.json()) as SendMessageResponse;
}

export async function receiveNotifications(
  credentials: GreenApiCredentials,
  receiveTimeout = 20,
  signal?: AbortSignal,
): Promise<ReceiveNotificationResponse | null> {
  const url = `${credentials.apiUrl}/waInstance${credentials.idInstance}/receiveNotification/${credentials.apiTokenInstance}?receiveTimeout=${receiveTimeout}`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Ошибка получения уведомлений: ${response.status}`);
  }

  return (await response.json()) as ReceiveNotificationResponse | null;
}

export async function deleteNotification(
  credentials: GreenApiCredentials,
  receiptId: number,
  signal?: AbortSignal,
): Promise<boolean> {
  const url = `${credentials.apiUrl}/waInstance${credentials.idInstance}/deleteNotification/${credentials.apiTokenInstance}/${receiptId}`;

  const response = await fetch(url, {
    method: "DELETE",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Ошибка удаления уведомления: ${response.status}`);
  }

  const data = (await response.json()) as { result: boolean };
  return data.result;
}
