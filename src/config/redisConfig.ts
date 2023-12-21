
import Redis from 'ioredis';


class RedisConfig {
    public client: Redis = new Redis();
    constructor() { }

    async initConfig() {
        this.client = new Redis();
        this.client.on('error', (err: Error) => console.log('Redis Client Error', err));
    }

}



export default RedisConfig;