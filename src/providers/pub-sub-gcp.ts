import { PubSub } from "@google-cloud/pubsub";
import type { Messages, MessagingProvider } from "./messaging-provider";
import { env } from "../env";

export class PubSubGcp implements MessagingProvider {
  private _client: PubSub;

  constructor() {
    this._client = new PubSub({
      projectId: env.PUB_SUB_PROJECT_ID,
      credentials: {
        client_email: env.PUB_SUB_CLIENT_EMAIL,
        private_key: env.PUB_SUB_PRIVATE_KEY,
      },
    });
  }

  async send(topic: string, messages: Messages[]) {
    const data = Buffer.from(JSON.stringify(messages[0]));

    await this._client.topic(topic).publishMessage({
      data,
    });
  }
}
