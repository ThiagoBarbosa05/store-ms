import { Kafka } from "kafkajs";
import type { Messages, MessagingProvider } from "./messaging-provider";
import { env } from "../env";

export class MessagingProviderImpl implements MessagingProvider {
  private _client: Kafka;

  constructor() {
    this._client = new Kafka({
      clientId: env.KAFKA_CLIENT_ID,
      brokers: [env.KAFKA_BROKER],
    });
  }

  async send(topic: string, messages: Messages[]): Promise<void> {
    const producer = this._client.producer();
    await producer.connect();

    await producer.send({
      topic,
      messages: messages.map((message) => message),
    });

    await producer.disconnect();
  }
}
