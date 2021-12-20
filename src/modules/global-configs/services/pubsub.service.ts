import { Injectable } from '@nestjs/common'
import { PubSub, Topic } from '@google-cloud/pubsub'
import { InvalidArgumentsError } from '@common/errors'
import { GOOGLE_PROJECT_ID, PUBSUB_TOPIC_NAME } from '@common/constants'

@Injectable()
export class PubSubService {
  private readonly pubSub: PubSub

  private topic: Topic

  constructor() {
    this.pubSub = new PubSub({
      projectId: GOOGLE_PROJECT_ID
    })
    this.topic = this.pubSub.topic(PUBSUB_TOPIC_NAME)
  }

  public async sendMessageToTopic(message: any): Promise<string[]> {
    // sanity check
    if (!message) {
      throw new InvalidArgumentsError({
        error: 'missing message argument'
      })
    }

    const payload = {
      data: message
    }
    const bufferMessage = Buffer.from(JSON.stringify(payload))
    const messageId = await this.topic.publishMessage({ data: bufferMessage })

    return messageId
  }
}
