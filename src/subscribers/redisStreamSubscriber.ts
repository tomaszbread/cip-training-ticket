
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
    this.socketConfig = socketConfig;
    this.redis = new RedisConfig();
    this.locationAlertService = new LocationAlertService();
  }



  public async subscribeToStream() {
    try {
      this.redis.client.subscribe(this.streamKey, (err, count) => {
        if (err) {
          console.error('Error while subscribing to stream:', err);
        } else {
          console.log(`Subscribed to ${count} channels`);
        }
      });

      this.redis.client.on('message', async (channel, message: string) => {
        const locationAlert = JSON.parse(message);
        this.handleLocationAlert(locationAlert);
      });
    } catch (error) {
      console.error('Error in subscribeToStream:', error);
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
    await this.locationAlertService.fetchLocationAlertData();
    this.socketConfig.io.emit('new-location-alert', locationAlert);
  }


}




export default RedisStreamSubscriber;