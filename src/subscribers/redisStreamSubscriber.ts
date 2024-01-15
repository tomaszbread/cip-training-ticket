
import RedisConfig from "../config/redisConfig";
import SocketConfig from "../config/socketConfig";
import LocationAlert from "../models/locationAlert";
import LocationAlertService from "../services/locationAlertService";


class RedisStreamSubscriber {

  private redis: RedisConfig;
  private socketConfig: SocketConfig;
  private locationAlertService: LocationAlertService;

  private streamKey = "location-alert-stream";
  constructor(redisConfig: RedisConfig, socketConfig: any,) {
    this.socketConfig = socketConfig
    this.redis = new RedisConfig();
    this.locationAlertService = new LocationAlertService();
  }



  public async subscribeToStream() {

    try {

      // if (this.redis.client.status !== 'connect') {
      //   console.error('Redis connection is not active.');
      //   return;
      // }

      await this.configureRedis();

      // Subskrypcja do strumienia
      this.redis.client.subscribe(this.streamKey, (err, count) => {
        if (err) {
          console.error('Error while subscribing to stream:', err);
        } else {
          console.log(`Subscribed to ${count} channels`);
        }
      });

      this.redis.client.on('message', async (channel, message: string[]) => {
        const locationAlert = this.decodeMessageData(message)
        console.log('Received location alert:', locationAlert);
        this.handleLocationAlert(locationAlert)

      });
    } catch (error) {
      console.error('Error in subscribeToStream:', error);
    }

  }


  private async configureRedis() {
    const groupName = 'location-alert-group';
    const consumerName = 'location-alert-consumer';

    const streamExists = (await this.redis.client.exists(this.streamKey)) !== 0;

    if (!streamExists) {
      await this.redis.client.xgroup('CREATE', this.streamKey, groupName, '$', 'MKSTREAM');
    }

    const groupInfo: any = await this.redis.client.xinfo('GROUPS', this.streamKey);
    const consumerExists = groupInfo.some((info: any) => info[1] === groupName);

    if (!consumerExists) {
      await this.redis.client.xgroup('DESTROY', this.streamKey, groupName);
      await this.redis.client.xgroup('CREATE', this.streamKey, groupName, '$', 'MKSTREAM');
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

  private async handleLocationAlert(locationAlert: any): Promise<void> {
    await this.locationAlertService.saveLocationAlertToElasticSearch(locationAlert);
    const updatedData = await this.locationAlertService.fetchLocationAlertData();
    this.socketConfig.io.emit('new-location-alert', locationAlert);
  }


}




export default RedisStreamSubscriber;