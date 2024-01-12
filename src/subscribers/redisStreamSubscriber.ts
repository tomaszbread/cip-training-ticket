
import RedisConfig from "../config/redisConfig";
import LocationAlert from "../models/locationAlert";


class RedisStreamSubscriber {

  private redis: RedisConfig;
  private groupName = "location-alert-group";
  private consumerName = "location-consumer";
  private streamKey = "location-alert-stream";
  constructor() {
    this.redis = new RedisConfig();
  }

  public async subscribeToStreamWithGroup(streamKey: string, callback: any) {
    try {
      const streamExists = (await this.redis.client.exists(streamKey)) !== 0;

      if (streamExists) {
        const groupInfo: any = await this.redis.client.xinfo('GROUPS', streamKey);
        if (!groupInfo.some((info: any) => info[1] === this.groupName)) {
          await this.redis.client.xgroup('CREATE', streamKey, this.groupName, '$', 'MKSTREAM');
        } else {
          await this.redis.client.xgroup('DESTROY', streamKey, this.groupName);
          await this.redis.client.xgroup('CREATE', streamKey, this.groupName, '$', 'MKSTREAM');
        }

        const result = await this.redis.client.xreadgroup(
          'GROUP', this.groupName, this.consumerName,
          'BLOCK', 1000, 'STREAMS', streamKey, '>');

        if (result && result.length > 0) {
          const stream: any = result[0];
          const messages = stream[1];

          for (const [messageId, messageData] of messages) {
            const decodedMessage = this.decodeMessageData(messageData);

            console.log(`Received message with ID ${messageId}:`, decodedMessage);

            // Acknowledge the message as processed
            await this.redis.client.xack(streamKey, this.groupName, messageId);

            callback(decodedMessage);
          }
        }
      } else {
        console.error('No messages received from the stream.');
      }
    } catch (error: any) {
      console.error('Error while reading from the stream:', error.message);
    }
  }


  // public async subscribeToStream(streamKey: string, callback: any) {
  //   try {
  //     const result = await this.redis.client.xread('BLOCK', 0, 'STREAMS', streamKey, 0);

  //     if (result && result.length > 0) {
  //       const stream = result[0];
  //       const messages = stream[1];

  //       for (const [messageId, messageData] of messages) {
  //         const decodedMessage = this.decodeMessageData(messageData);

  //         console.log(`Received message with ID ${messageId}:`, decodedMessage);

  //         callback(decodedMessage);
  //       }
  //     } else {
  //       console.error('No messages received from the stream.');
  //     }
  //   } catch (error: any) {
  //     console.error('Error while reading from the stream:', error.message);

  //   }
  // }


  public decodeMessageData(messageData: string[]): LocationAlert {
    const decodedMessage: any = {} as LocationAlert;

    for (let i = 0; i < messageData.length; i += 2) {
      const key = messageData[i].toString();
      const value = messageData[i + 1].toString();
      if (key === 'latitude' || key === 'longitude') {
        decodedMessage[key] = parseFloat(value);
      } else {
        decodedMessage[key] = value;
      }
    }
    return decodedMessage;
  }


}




export default RedisStreamSubscriber;