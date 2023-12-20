import Redis from "ioredis";
import RedisConfig from "../config/redisConfig";


class RedisStreamSubscriber {

  private redis: RedisConfig;
  constructor() {
    this.redis = new RedisConfig();
  }

 public  subscribeToStream(streamName: string, callback: any) {
    this.redis.client.xread('BLOCK', 0, 'STREAMS', streamName, '0', (err, streams: any) => {
      if (err) {
        console.error('Error reading stream:', err);
        return;
      }
      callback(streams);
      // for (const [stream, messages] of streams) {
      //   for (const message of messages) {
      //     const [messageId, messageData] = message;
      //     const alert = JSON.parse(messageData.data);
   
      //   }
      // }

      // this.subscribeToStream(streamName, callback);
    });
  }
}

export default RedisStreamSubscriber;