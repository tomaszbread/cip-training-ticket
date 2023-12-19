
import Redis from 'ioredis';


class RedisConfig {
    public redisClient: any;
    constructor() { }

    async initConfig() {
        this.redisClient = new Redis();
        console.log(this.redisClient.status);
        this.redisClient.on('error', (err: Error) => console.log('Redis Client Error', err));
    }

}



export default RedisConfig;