import IORedis from 'ioredis';

class RedisStreamSubscriber {
  private redisSubscriber: IORedis;

  constructor() {
    this.redisSubscriber = new IORedis();
  }

  public async subscribeToStream(streamKey: string, callback: (message: any) => void): Promise<void> {
    await this.redisSubscriber.subscribe(streamKey);

    this.redisSubscriber.on('message', (channel, message) => {
      if (channel === streamKey) {
        const parsedMessage = JSON.parse(message);
        callback(parsedMessage);
      }
    });
  }
}

export default RedisStreamSubscriber;