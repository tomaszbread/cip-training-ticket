
import { createClient } from 'redis';

class RedisConfig {
    public redisClient: any
    constructor() { }

    async initConfig() {
        this.redisClient = createClient();
        this.redisClient.on('error', (err: Error) => console.log('Redis Client Error', err));
        await this.redisClient.connect();
        this.redisClient.on('error',  (err: Error) => console.log('Redis Client Error', err));
    }

}



export default RedisConfig;