import Redis from "ioredis";
import RedisConfig from "../config/redisConfig";


class RedisStreamSubscriber {

  private redisConfig: RedisConfig;
  constructor() {
    this.redisConfig = new RedisConfig();
  }

  public async subscribeToStream(streamKey: string, callback: (message: any) => void): Promise<void> {
    await this.redisConfig.redisClient.subscribe(streamKey);

    this.redisConfig.redisClient.on('message', (channel: any, message: any) => {
      if (channel === streamKey) {
        const parsedMessage = JSON.parse(message);
        callback(parsedMessage);
      }
    });
  }
}

export default RedisStreamSubscriber;