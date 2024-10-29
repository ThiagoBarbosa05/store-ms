export interface Messages {
  key: string;
  value: string;
}

export interface MessagingProvider {
  send(topic: string, messages: Messages[]): Promise<void>;
}
