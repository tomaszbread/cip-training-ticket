
import RedisConfig from "../config/redisConfig";
import LocationAlert from "../models/locationAlert";


class RedisStreamSubscriber {

  private redis: RedisConfig;
  constructor() {
    this.redis = new RedisConfig();
  }

  public async subscribeToStream(streamKey: string, callback: any) {
    const result = await this.redis.client.xread('BLOCK', 0, 'STREAMS', streamKey, 0);
    if (result) {
      const stream = result[0];
      const messages = stream[1];

      for (const [messageId, messageData] of messages) {
        const decodedMessage = this.decodeMessageData(messageData);

        console.log(`Received message with ID ${messageId}:`, decodedMessage);

        callback(decodedMessage);
      }
    }
  }


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